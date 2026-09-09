import mongoose, { Schema, Document } from 'mongoose';
import { IPestObservation } from '../types';

export interface IPestObservationDocument extends Omit<IPestObservation, 'id' | '_id'>, Document {}

const PestObservationSchema = new Schema<IPestObservationDocument>(
  {
    farmerId: { type: String, default: 'farmer-101' },
    cropName: { type: String, required: true },
    trapType: {
      type: String,
      enum: ['Sticky Trap', 'Pheromone Trap', 'Light Trap', 'Field Specimen'],
      default: 'Sticky Trap',
    },
    pestName: { type: String, required: true },
    estimatedCount: { type: Number, default: 0 },
    etlStatus: {
      type: String,
      enum: ['BELOW_ETL', 'NEAR_ETL', 'EXCEEDED_ETL'],
      default: 'BELOW_ETL',
    },
    imageUrl: { type: String, default: '' },
    location: {
      district: { type: String, default: 'Ludhiana' },
      state: { type: String, default: 'Punjab' },
      latitude: { type: Number, default: 30.901 },
      longitude: { type: Number, default: 75.8573 },
    },
    severity: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    observationDate: { type: String, default: () => new Date().toISOString() },
    notes: { type: String, default: '' },
    recommendedAction: { type: String, default: '' },
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

export const PestObservationModel =
  mongoose.models.PestObservation || mongoose.model<IPestObservationDocument>('PestObservation', PestObservationSchema);
