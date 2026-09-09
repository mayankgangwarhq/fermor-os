import mongoose, { Schema, Document } from 'mongoose';
import { IHotspot } from '../types';

export interface IHotspotDocument extends Omit<IHotspot, 'id' | '_id'>, Document {}

const HotspotSchema = new Schema<IHotspotDocument>(
  {
    title: { type: String, required: true },
    category: { type: String, enum: ['disease', 'pest'], default: 'disease' },
    pathogenOrPest: { type: String, required: true },
    crop: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    reportedCases: { type: Number, default: 1 },
    affectedAreaAcres: { type: Number, default: 10 },
    radiusKm: { type: Number, default: 5 },
    lastReportedDate: { type: String, default: () => new Date().toISOString() },
    status: { type: String, enum: ['active', 'contained', 'monitored'], default: 'active' },
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

export const HotspotModel = mongoose.models.Hotspot || mongoose.model<IHotspotDocument>('Hotspot', HotspotSchema);
