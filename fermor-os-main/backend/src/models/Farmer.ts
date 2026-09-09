import mongoose, { Schema, Document } from 'mongoose';
import { IFarmer } from '../types';

export interface IFarmerDocument extends Omit<IFarmer, 'id' | '_id'>, Document {}

const FarmerSchema = new Schema<IFarmerDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    farmerId: {
      type: String,
      required: true,
      unique: true,
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    totalLandAcres: {
      type: Number,
      default: 0,
    },
    primaryCrops: {
      type: [String],
      default: [],
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'verified',
    },
    govtIdType: {
      type: String,
      default: 'Aadhaar',
    },
    govtIdNumber: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_, ret: any) => {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const FarmerModel = mongoose.models.Farmer || mongoose.model<IFarmerDocument>('Farmer', FarmerSchema);
