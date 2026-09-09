import mongoose, { Schema, Document } from 'mongoose';
import { IAlert } from '../types';

export interface IAlertDocument extends Omit<IAlert, 'id' | '_id'>, Document {}

const AlertSchema = new Schema<IAlertDocument>(
  {
    title: {
      type: String,
      required: [true, 'Alert title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Alert description is required'],
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['DISEASE', 'PEST', 'WEATHER', 'IRRIGATION', 'CROP_RISK'],
      default: 'WEATHER',
      required: true,
      index: true,
    },
    farmId: {
      type: String,
      index: true,
    },
    cropId: {
      type: String,
      index: true,
    },
    farmerId: {
      type: String,
      index: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    actionableStep: {
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

export const AlertModel = mongoose.models.Alert || mongoose.model<IAlertDocument>('Alert', AlertSchema);
