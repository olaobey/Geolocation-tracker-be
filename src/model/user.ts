import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
//   _id: string;
  fullName: string;
  email: string;
  phoneNumber?: number;
  profileImage?: string;
  googleId: string;
  password: string;
  isVerified: boolean;
  emailVerificationTokenExpiresAt: Date | null;
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  fullName: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
    required: true,
    unique: true,
    index: true
  },
  googleId: {
    type: String
  },
  profileImage: {
    type: String,
    default: 'https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg'
  },
  phoneNumber: {
    type: Number,
    default: ''
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationTokenExpiresAt: {
    type: Date,
    default: null,
  },
},
{
  timestamps: true, 
});

export default mongoose.model<IUser>('User', userSchema);