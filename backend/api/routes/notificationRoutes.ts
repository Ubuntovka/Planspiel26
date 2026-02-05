import express, { Response } from 'express';
import auth, { CustomRequest } from '../../middleware/auth';
import {
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../controllers/notificationController';

const router = express.Router();
router.use(auth);

/** GET /api/notifications - List notifications (optional ?unreadOnly=true&limit=50) */
router.get('/', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const unreadOnly = req.query.unreadOnly === 'true';
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
  const result = await listNotifications(req.user._id.toString(), { unreadOnly, limit });
  return res.status(200).json(result);
});

/** PATCH /api/notifications/read-all - Mark all as read */
router.patch('/read-all', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await markAllNotificationsRead(req.user._id.toString());
  return res.status(200).json(result);
});

/** PATCH /api/notifications/:id/read - Mark single notification as read */
router.patch('/:id/read', async (req: CustomRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const result = await markNotificationRead(req.params.id, req.user._id.toString());
  if ('error' in result) {
    const status = result.error === 'Notification not found' ? 404 : 400;
    return res.status(status).json({ error: result.error });
  }
  return res.status(200).json(result);
});

export default router;
