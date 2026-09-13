import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '../types';

export interface IUserDocument extends Omit<IUser, 'id' | '_id'>, Document {}

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['farmer', 'buyer', 'expert', 'equipment_owner', 'admin'],
      default: 'farmer',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    state: {
      type: String,
      default: 'Madhya Pradesh',
    },
    district: {
      type: String,
      default: 'Indore',
    },
    village: {
      type: String,
      default: 'Sanwer',
    },
    language: {
      type: String,
      default: 'en',
    },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    bio: {
      type: String,
      default: '',
    },
    authMethod: {
      type: String,
      enum: ['email', 'aadhaar_demo'],
      default: 'email',
    },
    aadhaarHash: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    aadhaarLast4: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
