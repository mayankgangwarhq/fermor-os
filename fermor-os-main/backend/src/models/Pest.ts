import mongoose, { Schema, Document } from 'mongoose';
import { IPest } from '../types';

export interface IPestDocument extends Omit<IPest, 'id' | '_id'>, Document {}

const PestSchema = new Schema<IPestDocument>(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      index: true,
      trim: true,
    },
    pestName: {
      type: String,
      required: [true, 'Pest name is required'],
      trim: true,
    },
    scientificName: {
      type: String,
      default: '',
    },
    identification: {
      type: [String],
      default: [],
    },
    symptoms: {
      type: [String],
      default: [],
    },
    management: {
      type: [String],
      default: [],
    },
    organicControl: {
      type: [String],
      default: [],
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    seasonalPeak: {
      type: String,
      default: '',
    },
    imageUrl: {
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

export const PestModel = mongoose.models.Pest || mongoose.model<IPestDocument>('Pest', PestSchema);
