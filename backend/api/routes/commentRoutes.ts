import express, { Response } from 'express';
import auth, { CustomRequest } from '../../middleware/auth';
import {
  getDiagramCollaborators,
  listComments,
  createComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController';

const router = express.Router({ mergeParams: true });
router.use(auth);

/** GET .../diagrams/:id/collaborators - List users with access (for @mention) */
router.get('/collaborators', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const diagramId = req.params.id;
  const result = await getDiagramCollaborators(diagramId, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** GET .../diagrams/:id/comments - List comments for diagram */
router.get('/comments', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await listComments(req.params.id, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** POST .../diagrams/:id/comments - Create comment (with optional @mentions) */
router.post('/comments', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { content, anchor, mentions } = req.body || {};
  const result = await createComment(req.params.id, req.user._id.toString(), {
    content,
    anchor,
    mentions: Array.isArray(mentions) ? mentions : undefined,
  });
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(201).json(result);
});

/** PATCH .../diagrams/:id/comments/:commentId - Update comment (content or resolved) */
router.patch('/comments/:commentId', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { content, resolved } = req.body || {};
  const result = await updateComment(
    req.params.id,
    req.params.commentId,
    req.user._id.toString(),
    { content, resolved }
  );
  if ('error' in result) {
    const status = result.error === 'Comment not found' ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** DELETE .../diagrams/:id/comments/:commentId - Delete comment */
router.delete('/comments/:commentId', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await deleteComment(req.params.id, req.params.commentId, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Comment not found' ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

export default router;
