import mongoose, { Schema, Document } from 'mongoose';
import { ILabReferral } from '../types';

export interface ILabReferralDocument extends Omit<ILabReferral, 'id' | '_id'>, Document {}

const LabReferralSchema = new Schema<ILabReferralDocument>(
  {
    caseId: { type: String, required: true },
    farmerId: { type: String, default: 'farmer-101' },
    farmerName: { type: String, default: 'Ram Kumar' },
    cropName: { type: String, required: true },
    suspectedIssue: { type: String, required: true },
    severity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    confidenceScore: { type: Number, default: 68 },
    reasonForReferral: { type: String, required: true },
    targetLabName: { type: String, default: 'District Krishi Vigyan Kendra (KVK) Plant Pathology Diagnostic Lab' },
    location: { type: String, default: 'Ludhiana, Punjab' },
    status: {
      type: String,
      enum: ['Pending', 'Under Review', 'Referred', 'Verified', 'Resolved'],
      default: 'Referred',
    },
    createdDate: { type: String, default: () => new Date().toISOString() },
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

export const LabReferralModel =
  mongoose.models.LabReferral || mongoose.model<ILabReferralDocument>('LabReferral', LabReferralSchema);
