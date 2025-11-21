import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  pictureUrl?: string | null;
  lastLoginDate?: Date | null;
  createdDate: Date;
  preferredLanguage: string;
  isDeleted: boolean;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
  twoFactorVerified?: boolean;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /^.+@.+\..+$/,
  },
  pictureUrl: { type: String, default: null },
  lastLoginDate: { type: Date, default: null },
  createdDate: { type: Date, default: Date.now },
  preferredLanguage: { type: String, default: 'en' },
  isDeleted: { type: Boolean, default: false },
  isTwoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null },
  twoFactorVerified: { type: Boolean, default: false },
});

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
