import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICommentAnchor {
  type: 'point' | 'node' | 'edge';
  nodeId?: string;
  edgeId?: string;
  x?: number;
  y?: number;
}

export interface IComment extends Document {
  diagramId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  anchor?: ICommentAnchor;
  mentions: mongoose.Types.ObjectId[];
  resolved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    diagramId: { type: Schema.Types.ObjectId, ref: 'Diagram', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    anchor: {
      type: {
        type: String,
        enum: ['point', 'node', 'edge'],
        default: 'point',
      },
      nodeId: String,
      edgeId: String,
      x: Number,
      y: Number,
    },
    mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    resolved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
