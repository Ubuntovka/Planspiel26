import mongoose from 'mongoose';
import Notification from '../../models/Notification';

export interface NotificationItem {
  _id: string;
  type: string;
  commentId: string;
  diagramId: string;
  diagramName?: string;
  fromUserId?: string;
  read: boolean;
  createdAt: Date;
}

export async function listNotifications(
  userId: string,
  options: { unreadOnly?: boolean; limit?: number } = {}
): Promise<{ notifications: NotificationItem[]; unreadCount: number }> {
  const query: any = { userId: new mongoose.Types.ObjectId(userId) };
  if (options.unreadOnly) query.read = false;
  const limit = Math.min(options.limit ?? 50, 100);
  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('fromUserId', 'email firstName lastName')
    .lean();
  const unreadCount = await Notification.countDocuments({
    userId: new mongoose.Types.ObjectId(userId),
    read: false,
  });
  const list: NotificationItem[] = notifications.map((n: any) => ({
    _id: n._id.toString(),
    type: n.type,
    commentId: n.commentId.toString(),
    diagramId: n.diagramId.toString(),
    diagramName: n.diagramName,
    fromUserId: n.fromUserId?._id?.toString(),
    read: n.read ?? false,
    createdAt: n.createdAt,
  }));
  return { notifications: list, unreadCount };
}

export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<{ notification: NotificationItem } | { error: string }> {
  if (!mongoose.Types.ObjectId.isValid(notificationId)) {
    return { error: 'Invalid notification ID' };
  }
  const notification = await Notification.findOne({
    _id: notificationId,
    userId: new mongoose.Types.ObjectId(userId),
  });
  if (!notification) return { error: 'Notification not found' };
  notification.read = true;
  await notification.save();
  return {
    notification: {
      _id: notification._id.toString(),
      type: notification.type,
      commentId: notification.commentId.toString(),
      diagramId: notification.diagramId.toString(),
      diagramName: notification.diagramName,
      fromUserId: notification.fromUserId?.toString(),
      read: true,
      createdAt: notification.createdAt,
    },
  };
}

export async function markAllNotificationsRead(userId: string): Promise<{ updated: number }> {
  const result = await Notification.updateMany(
    { userId: new mongoose.Types.ObjectId(userId), read: false },
    { $set: { read: true } }
  );
  return { updated: result.modifiedCount };
}
