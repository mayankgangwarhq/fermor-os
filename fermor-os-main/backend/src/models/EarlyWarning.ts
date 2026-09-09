import mongoose, { Schema, Document } from 'mongoose';
import { IEarlyWarning } from '../types';

export interface IEarlyWarningDocument extends Omit<IEarlyWarning, 'id' | '_id'>, Document {}

const EarlyWarningSchema = new Schema<IEarlyWarningDocument>(
  {
    crop: { type: String, required: true },
    district: { type: String, required: true },
    state: { type: String, required: true },
    growthStage: { type: String, default: 'Vegetative' },
    diseaseRiskScore: { type: Number, default: 45 },
    pestRiskScore: { type: Number, default: 35 },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
    causalityReason: { type: String, default: '' },
    recommendedAction: { type: String, default: '' },
    forecastTrend: [
      {
        day: String,
        riskScore: Number,
        weatherFactor: String,
      },
    ],
    generatedAt: { type: String, default: () => new Date().toISOString() },
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

export const EarlyWarningModel =
  mongoose.models.EarlyWarning || mongoose.model<IEarlyWarningDocument>('EarlyWarning', EarlyWarningSchema);
