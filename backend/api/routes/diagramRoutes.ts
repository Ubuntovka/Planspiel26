import express, { Response } from 'express';
import auth, { CustomRequest } from '../../middleware/auth';
import {
  listDiagrams,
  createDiagram,
  getDiagram,
  updateDiagram,
  renameDiagram,
  deleteDiagram,
  listSharedWith,
  shareDiagram,
  unshareDiagram,
  updateSharedRole,
  transferOwnership,
} from '../controllers/diagramController';
import commentRoutes from './commentRoutes';

const router = express.Router();

// All diagram routes require authentication
router.use(auth);

/** GET /api/diagrams - List all diagrams for the current user */
router.get('/', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await listDiagrams(req.user._id.toString());
  return res.status(200).json(result);
});

/** POST /api/diagrams - Create a new diagram */
router.post('/', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { name, nodes, edges, viewport } = req.body || {};
  const result = await createDiagram(req.user._id.toString(), {
    name,
    nodes,
    edges,
    viewport,
  });
  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }
  return res.status(201).json(result);
});

/** GET /api/diagrams/:id/shared - List users with access (owner only) */
router.get('/:id/shared', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await listSharedWith(req.params.id, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** POST /api/diagrams/:id/share - Share with user by email (owner only) */
router.post('/:id/share', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { email, role } = req.body || {};
  const r = role === 'owner' ? 'owner' : role === 'editor' ? 'editor' : 'viewer';
  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'email is required' });
  }
  const result = await shareDiagram(req.params.id, req.user._id.toString(), email.trim(), r);
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** DELETE /api/diagrams/:id/share/:targetUserId - Remove access (owner only) */
router.delete('/:id/share/:targetUserId', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await unshareDiagram(req.params.id, req.user._id.toString(), req.params.targetUserId);
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** PATCH /api/diagrams/:id/share/:targetUserId - Update role (owner only) */
router.patch('/:id/share/:targetUserId', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { role } = req.body || {};
  const r = role === 'owner' ? 'owner' : role === 'editor' ? 'editor' : 'viewer';
  const result = await updateSharedRole(req.params.id, req.user._id.toString(), req.params.targetUserId, r);
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** POST /api/diagrams/:id/transfer-owner - Transfer ownership (owner only) */
router.post('/:id/transfer-owner', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { targetUserId } = req.body || {};
  if (!targetUserId || typeof targetUserId !== 'string') {
    return res.status(400).json({ error: 'targetUserId is required' });
  }
  const result = await transferOwnership(req.params.id, req.user._id.toString(), targetUserId);
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** GET /api/diagrams/:id - Get a single diagram */
router.get('/:id', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await getDiagram(req.params.id, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** PATCH /api/diagrams/:id/rename - Rename diagram */
router.patch('/:id/rename', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { name } = req.body || {};
  if (typeof name !== 'string') {
    return res.status(400).json({ error: 'name is required' });
  }
  const result = await renameDiagram(req.params.id, req.user._id.toString(), name);
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** PATCH /api/diagrams/:id - Update diagram (full content or partial) */
router.patch('/:id', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { name, nodes, edges, viewport } = req.body || {};
  const result = await updateDiagram(req.params.id, req.user._id.toString(), {
    name,
    nodes,
    edges,
    viewport,
  });
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** DELETE /api/diagrams/:id - Delete a diagram */
router.delete('/:id', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await deleteDiagram(req.params.id, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Invalid diagram ID' ? 400 : 404;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** Mount comment & collaborators under /:id (e.g. /:id/comments, /:id/collaborators) */
router.use('/:id', commentRoutes);

export default router;
