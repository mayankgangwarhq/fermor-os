import mongoose, { Schema, Document } from 'mongoose';
import { IFollowUp } from '../types';

export interface IFollowUpDocument extends Omit<IFollowUp, 'id' | '_id'>, Document {}

const FollowUpSchema = new Schema<IFollowUpDocument>(
  {
    caseId: { type: String, required: true },
    cropName: { type: String, required: true },
    initialDisease: { type: String, required: true },
    farmerName: { type: String, default: 'Ram Kumar' },
    day0Date: { type: String, default: () => new Date().toISOString() },
    day0Image: { type: String, default: '' },
    day3Date: { type: String },
    day3Image: { type: String },
    day3Status: { type: String, enum: ['Improving', 'Stable', 'Worsened'] },
    day3Notes: { type: String },
    day7Date: { type: String },
    day7Image: { type: String },
    day7Status: { type: String, enum: ['Healed', 'Stable', 'Worsened'] },
    day7Notes: { type: String },
    currentStage: {
      type: String,
      enum: ['Day 0', 'Day 3', 'Day 7', 'Resolved'],
      default: 'Day 0',
    },
    overallTrend: {
      type: String,
      enum: ['Improvement', 'Stable', 'Worsening'],
      default: 'Stable',
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

export const FollowUpModel = mongoose.models.FollowUp || mongoose.model<IFollowUpDocument>('FollowUp', FollowUpSchema);
