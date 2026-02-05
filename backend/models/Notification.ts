import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'comment_mention';
  commentId: mongoose.Types.ObjectId;
  diagramId: mongoose.Types.ObjectId;
  diagramName?: string;
  fromUserId?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['comment_mention'], required: true },
    commentId: { type: Schema.Types.ObjectId, ref: 'Comment', required: true },
    diagramId: { type: Schema.Types.ObjectId, ref: 'Diagram', required: true },
    diagramName: { type: String, trim: true },
    fromUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
