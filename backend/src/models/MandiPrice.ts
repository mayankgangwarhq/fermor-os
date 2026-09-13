import mongoose, { Schema, Document } from 'mongoose';
import { IMandiPrice } from '../types';

export interface IMandiPriceDocument extends Omit<IMandiPrice, 'id' | '_id'>, Document {}

const MandiPriceSchema = new Schema<IMandiPriceDocument>(
  {
    commodity: {
      type: String,
      required: [true, 'Commodity name is required'],
      index: true,
      trim: true,
    },
    variety: {
      type: String,
      default: 'Standard',
      trim: true,
    },
    grade: {
      type: String,
      default: 'FAQ',
      trim: true,
    },
    market: {
      type: String,
      required: [true, 'Mandi/Market name is required'],
      index: true,
      trim: true,
    },
    district: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    modalPrice: {
      type: Number,
      required: true,
    },
    minPrice: {
      type: Number,
      required: true,
    },
    maxPrice: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      default: '₹/quintal',
    },
    priceChangePercent: {
      type: Number,
      default: 0,
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable',
    },
    arrivalTonnes: {
      type: Number,
      default: 0,
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
      index: true,
    },
    isDemo: {
      type: Boolean,
      default: true,
    },
    sourceStatus: {
      type: String,
      default: 'DEMO DATA',
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

export const MandiPriceModel =
  mongoose.models.MandiPrice || mongoose.model<IMandiPriceDocument>('MandiPrice', MandiPriceSchema);
