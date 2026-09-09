import mongoose, { Schema, Document } from 'mongoose';
import { ICrop } from '../types';

export interface ICropDocument extends Omit<ICrop, 'id' | '_id'>, Document {}

const CropSchema = new Schema<ICropDocument>(
  {
    farmId: {
      type: String,
      required: [true, 'Farm ID is required'],
      index: true,
    },
    farmerId: {
      type: String,
      index: true,
    },
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },
    variety: {
      type: String,
      required: [true, 'Crop variety is required'],
      trim: true,
    },
    sowingDate: {
      type: Date,
      required: [true, 'Sowing date is required'],
    },
    expectedHarvestDate: {
      type: Date,
      required: [true, 'Expected harvest date is required'],
    },
    growthStage: {
      type: String,
      default: 'Vegetative Stage',
    },
    status: {
      type: String,
      enum: ['planned', 'sown', 'growing', 'harvest_ready', 'harvested', 'sold'],
      default: 'growing',
    },
    estimatedYieldKg: {
      type: Number,
      default: 0,
    },
    actualYieldKg: {
      type: Number,
      default: 0,
    },
    areaAllocated: {
      type: Number,
      default: 0,
    },
    notes: {
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

export const CropModel = mongoose.models.Crop || mongoose.model<ICropDocument>('Crop', CropSchema);
