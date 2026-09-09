import mongoose, { Schema, Document } from 'mongoose';
import { IFarm } from '../types';

export interface IFarmDocument extends Omit<IFarm, 'id' | '_id'>, Document {}

const FarmSchema = new Schema<IFarmDocument>(
  {
    farmerId: {
      type: String,
      required: [true, 'Farmer ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Farm name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    district: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    area: {
      type: Number,
      required: [true, 'Farm area is required'],
      min: [0.1, 'Area must be greater than 0'],
    },
    unit: {
      type: String,
      enum: ['acres', 'bigha', 'hectares'],
      default: 'acres',
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy'],
      default: 'Black',
    },
    irrigation: {
      type: String,
      enum: ['Canal', 'Borewell', 'Drip', 'Rainfed', 'Sprinkler'],
      default: 'Borewell',
    },
    farmingType: {
      type: String,
      enum: ['Organic', 'Conventional', 'Mixed'],
      default: 'Mixed',
    },
    crops: {
      type: [String],
      default: [],
    },
    coordinates: {
      latitude: { type: Number, default: 22.7196 },
      longitude: { type: Number, default: 75.8577 },
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
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

export const FarmModel = mongoose.models.Farm || mongoose.model<IFarmDocument>('Farm', FarmSchema);
