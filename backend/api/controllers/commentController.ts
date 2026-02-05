import mongoose from 'mongoose';
import Diagram from '../../models/Diagram';
import User from '../../models/User';
import Comment, { IComment, ICommentAnchor } from '../../models/Comment';
import Notification from '../../models/Notification';
import { getDiagram } from './diagramController';

export interface CommentAnchorInput {
  type: 'point' | 'node' | 'edge';
  nodeId?: string;
  edgeId?: string;
  x?: number;
  y?: number;
}

export interface CreateCommentInput {
  content: string;
  anchor?: CommentAnchorInput;
  mentions?: string[]; // user IDs
}

export interface CommentWithAuthor {
  _id: string;
  diagramId: string;
  userId: string;
  content: string;
  anchor?: ICommentAnchor;
  mentions: string[];
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
  author?: { _id: string; email: string; firstName?: string; lastName?: string };
}

function getAccessLevel(diagram: any, userId: string): string {
  const uid = userId.toString();
  if (diagram.userId.toString() === uid) return 'owner';
  const entry = diagram.sharedWith?.find((e: any) => e.userId.toString() === uid);
  return entry ? entry.role : '';
}

export async function getDiagramCollaborators(
  diagramId: string,
  userId: string
): Promise<{ users: { _id: string; email: string; firstName?: string; lastName?: string }[] } | { error: string }> {
  const result = await getDiagram(diagramId, userId);
  if ('error' in result) return result;
  const diagram = result.diagram;
  const ids: mongoose.Types.ObjectId[] = [diagram.userId as mongoose.Types.ObjectId];
  for (const e of diagram.sharedWith || []) {
    ids.push(e.userId);
  }
  const users = await User.find({ _id: { $in: ids } })
    .select('_id email firstName lastName')
    .lean();
  return {
    users: users.map((u: any) => ({
      _id: u._id.toString(),
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
    })),
  };
}

export async function listComments(
  diagramId: string,
  userId: string
): Promise<{ comments: CommentWithAuthor[] } | { error: string }> {
  const result = await getDiagram(diagramId, userId);
  if ('error' in result) return result;
  const comments = await Comment.find({ diagramId: new mongoose.Types.ObjectId(diagramId) })
    .sort({ createdAt: 1 })
    .populate('userId', 'email firstName lastName')
    .lean();
  const list: CommentWithAuthor[] = comments.map((c: any) => ({
    _id: c._id.toString(),
    diagramId: c.diagramId.toString(),
    userId: c.userId._id.toString(),
    content: c.content,
    anchor: c.anchor,
    mentions: (c.mentions || []).map((m: any) => m.toString()),
    resolved: c.resolved ?? false,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    author: c.userId
      ? {
          _id: c.userId._id.toString(),
          email: c.userId.email,
          firstName: c.userId.firstName,
          lastName: c.userId.lastName,
        }
      : undefined,
  }));
  return { comments: list };
}

export async function createComment(
  diagramId: string,
  userId: string,
  input: CreateCommentInput
): Promise<{ comment: CommentWithAuthor } | { error: string }> {
  const result = await getDiagram(diagramId, userId);
  if ('error' in result) return result;
  const diagram = result.diagram;
  const accessLevel = getAccessLevel(diagram, userId);
  if (accessLevel !== 'owner' && accessLevel !== 'editor' && accessLevel !== 'viewer') {
    return { error: 'You do not have permission to comment on this diagram' };
  }
  const content = (input.content || '').trim();
  if (!content) return { error: 'Comment content is required' };
  const mentionIds = (input.mentions || []).filter((id) => mongoose.Types.ObjectId.isValid(id));
  const comment = new Comment({
    diagramId: new mongoose.Types.ObjectId(diagramId),
    userId: new mongoose.Types.ObjectId(userId),
    content,
    anchor: input.anchor,
    mentions: mentionIds.map((id) => new mongoose.Types.ObjectId(id)),
    resolved: false,
  });
  await comment.save();
  const diagramDoc = await Diagram.findById(diagramId).select('name').lean();
  const diagramName = diagramDoc?.name;
  for (const mentionedId of mentionIds) {
    if (mentionedId === userId) continue;
    await Notification.create({
      userId: new mongoose.Types.ObjectId(mentionedId),
      type: 'comment_mention',
      commentId: comment._id,
      diagramId: new mongoose.Types.ObjectId(diagramId),
      diagramName,
      fromUserId: new mongoose.Types.ObjectId(userId),
      read: false,
    });
  }
  const populated = await Comment.findById(comment._id)
    .populate('userId', 'email firstName lastName')
    .lean();
  const c = populated as any;
  const commentWithAuthor: CommentWithAuthor = {
    _id: c._id.toString(),
    diagramId: c.diagramId.toString(),
    userId: c.userId._id.toString(),
    content: c.content,
    anchor: c.anchor,
    mentions: (c.mentions || []).map((m: any) => m.toString()),
    resolved: c.resolved ?? false,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
    author: c.userId
      ? { _id: c.userId._id.toString(), email: c.userId.email, firstName: c.userId.firstName, lastName: c.userId.lastName }
      : undefined,
  };
  return { comment: commentWithAuthor };
}

export async function updateComment(
  diagramId: string,
  commentId: string,
  userId: string,
  updates: { content?: string; resolved?: boolean }
): Promise<{ comment: CommentWithAuthor } | { error: string }> {
  const diagramResult = await getDiagram(diagramId, userId);
  if ('error' in diagramResult) return diagramResult;
  if (!mongoose.Types.ObjectId.isValid(commentId)) return { error: 'Invalid comment ID' };
  const comment = await Comment.findOne({
    _id: commentId,
    diagramId: new mongoose.Types.ObjectId(diagramId),
  });
  if (!comment) return { error: 'Comment not found' };
  if (comment.userId.toString() !== userId) {
    return { error: 'You can only edit your own comments' };
  }
  if (updates.content !== undefined) comment.content = updates.content.trim();
  if (updates.resolved !== undefined) comment.resolved = updates.resolved;
  await comment.save();
  const populated = await Comment.findById(comment._id)
    .populate('userId', 'email firstName lastName')
    .lean();
  const c = populated as any;
  return {
    comment: {
      _id: c._id.toString(),
      diagramId: c.diagramId.toString(),
      userId: c.userId._id.toString(),
      content: c.content,
      anchor: c.anchor,
      mentions: (c.mentions || []).map((m: any) => m.toString()),
      resolved: c.resolved ?? false,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      author: c.userId
        ? { _id: c.userId._id.toString(), email: c.userId.email, firstName: c.userId.firstName, lastName: c.userId.lastName }
        : undefined,
    },
  };
}

export async function deleteComment(
  diagramId: string,
  commentId: string,
  userId: string
): Promise<{ success: boolean } | { error: string }> {
  const diagramResult = await getDiagram(diagramId, userId);
  if ('error' in diagramResult) return diagramResult;
  if (!mongoose.Types.ObjectId.isValid(commentId)) return { error: 'Invalid comment ID' };
  const comment = await Comment.findOne({
    _id: commentId,
    diagramId: new mongoose.Types.ObjectId(diagramId),
  });
  if (!comment) return { error: 'Comment not found' };
  if (comment.userId.toString() !== userId) {
    return { error: 'You can only delete your own comments' };
  }
  await Notification.deleteMany({ commentId: comment._id });
  await Comment.deleteOne({ _id: commentId });
  return { success: true };
}
