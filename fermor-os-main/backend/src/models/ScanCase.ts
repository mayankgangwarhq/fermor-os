import mongoose, { Schema, Document } from 'mongoose';
import { IScanCase } from '../types';

export interface IScanCaseDocument extends Omit<IScanCase, 'id' | '_id'>, Document {}

const ScanCaseSchema = new Schema<IScanCaseDocument>(
  {
    farmerId: { type: String, default: 'farmer-101' },
    farmerName: { type: String, default: 'Ram Kumar' },
    farmerPhone: { type: String, default: '+91 98765 43210' },
    farmId: { type: String, default: 'farm-1' },
    cropName: { type: String, required: true, index: true },
    growthStage: { type: String, default: 'Vegetative' },
    imageUrl: { type: String, default: '' },
    suspectedIssue: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    symptoms: { type: [String], default: [] },
    location: {
      district: { type: String, default: 'Ludhiana' },
      state: { type: String, default: 'Punjab' },
      latitude: { type: Number, default: 30.901 },
      longitude: { type: Number, default: 75.8573 },
    },
    ipmAdvisory: {
      prevention: { type: [String], default: [] },
      cultural: { type: [String], default: [] },
      mechanical: { type: [String], default: [] },
      biological: { type: [String], default: [] },
      chemical: { type: [String], default: [] },
      monitoring: { type: [String], default: [] },
    },
    expertStatus: {
      type: String,
      enum: ['none', 'pending', 'verified', 'corrected', 'lab_referred'],
      default: 'none',
    },
    expertReview: { type: Schema.Types.Mixed },
    followUpStatus: {
      type: String,
      enum: ['none', 'day0', 'day3', 'day7', 'resolved'],
      default: 'none',
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

export const ScanCaseModel = mongoose.models.ScanCase || mongoose.model<IScanCaseDocument>('ScanCase', ScanCaseSchema);
