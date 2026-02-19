import express, { Response } from 'express';
import auth, { CustomRequest } from '../../middleware/auth';
import {
  createVersion,
  listVersions,
  getVersion,
  restoreVersion,
} from '../controllers/versionController';

const router = express.Router({ mergeParams: true });

router.use(auth);

/** POST /api/diagrams/:id/versions – save a version snapshot */
router.post('/', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { message, description } = req.body || {};
  const result = await createVersion(req.params.id, req.user._id.toString(), message, description);
  if ('error' in result) {
    return res.status(result.error.includes('not found') ? 404 : 400).json({ error: result.error });
  }
  return res.status(201).json(result);
});

/** GET /api/diagrams/:id/versions – list version summaries */
router.get('/', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await listVersions(req.params.id, req.user._id.toString());
  if ('error' in result) {
    return res.status(404).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** GET /api/diagrams/:id/versions/:versionId – full version payload */
router.get('/:versionId', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await getVersion(req.params.id, req.params.versionId, req.user._id.toString());
  if ('error' in result) {
    return res.status(result.error === 'Invalid version ID' ? 400 : 404).json({ error: result.error });
  }
  return res.status(200).json(result);
});

/** POST /api/diagrams/:id/versions/:versionId/restore */
router.post('/:versionId/restore', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await restoreVersion(req.params.id, req.params.versionId, req.user._id.toString());
  if ('error' in result) {
    return res.status(result.error.includes('not found') ? 404 : 400).json({ error: result.error });
  }
  return res.status(200).json(result);
});

export default router;
