import mongoose, {Schema, model, Document, Model, HydratedDocument} from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/config'

export interface IUser extends Document {
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tokens: { token: string }[];
  pictureUrl?: string | null;
  lastLoginDate?: Date | null;
  createdDate: Date;
  preferredLanguage: string;
  isDeleted: boolean;
  isTwoFactorEnabled?: boolean;
  twoFactorSecret?: string | null;
  twoFactorVerified?: boolean;
}

export interface IUserMethods {
  generateAuthToken(): Promise<string>
  toJSON(): any
}

interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByCredentials(email: string, password: string): Promise<HydratedDocument<IUser, IUserMethods> | null>
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: false, unique: false, trim: true },
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
  password: {type: String, required: true, minlength: 8},
  tokens: { type: [{ token: { type: String, required: true } }], default: [] },
  pictureUrl: { type: String, default: null },
  lastLoginDate: { type: Date, default: null },
  createdDate: { type: Date, default: Date.now },
  preferredLanguage: { type: String, default: 'en' },
  isDeleted: { type: Boolean, default: false },
  isTwoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: { type: String, default: null },
  twoFactorVerified: { type: Boolean, default: false },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 8)
  }
  next()
})

userSchema.methods.generateAuthToken = async function () {
  const user = this as any
  const token = jwt.sign({_id: user._id.toString()}, config.jwtSecret, {expiresIn: '1h'})
  user.tokens = (user.tokens || []).concat({token})
  await user.save()
  return token
}

userSchema.methods.toJSON = function () {
  const user = this as IUser
  const userObject = (user as any).toObject()
  delete userObject.password
  delete userObject.tokens
  return userObject
}

userSchema.statics.findByCredentials = async (email: string, password: string) => {
  const user = await User.findOne({email})
  if (!user) {
    return null
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return null
  }
  return user
}

// export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
const User = model<IUser, UserModel>('User', userSchema)

export default User;
