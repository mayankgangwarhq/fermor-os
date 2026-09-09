import mongoose, { Schema, Document } from 'mongoose';
import { IDiagnosticCase } from '../types';

export interface IDiagnosticCaseDocument extends Omit<IDiagnosticCase, 'id' | '_id'>, Document {}

const ClarificationQuestionSchema = new Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    selectedAnswer: { type: String },
  },
  { _id: false }
);

const AuditTrailSchema = new Schema(
  {
    timestamp: { type: String, required: true },
    action: { type: String, required: true },
    performedBy: { type: String, required: true },
    role: { type: String, required: true },
    previousStatus: { type: String },
    newStatus: { type: String, required: true },
    details: { type: String },
  },
  { _id: false }
);

const AIPredictionSchema = new Schema(
  {
    diseaseName: { type: String, required: true },
    scientificName: { type: String },
    confidenceScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    causes: { type: [String], default: [] },
    ipmAdvisory: {
      prevention: { type: [String], default: [] },
      cultural: { type: [String], default: [] },
      mechanical: { type: [String], default: [] },
      biological: { type: [String], default: [] },
      chemical: { type: [String], default: [] },
      monitoring: { type: [String], default: [] },
    },
  },
  { _id: false }
);

const DiagnosticCaseSchema = new Schema<IDiagnosticCaseDocument>(
  {
    farmerId: { type: String, required: true, index: true },
    farmerName: { type: String, required: true },
    farmerPhone: { type: String, default: '' },
    farmId: { type: String, index: true },
    cropId: { type: String },
    cropName: { type: String, required: true, index: true },
    cropStage: { type: String, default: 'Vegetative' },
    imageUrl: { type: String, required: true },
    location: {
      village: { type: String, default: '' },
      district: { type: String, required: true, default: 'Jaipur' },
      state: { type: String, required: true, default: 'Rajasthan' },
      latitude: { type: Number },
      longitude: { type: Number },
      formattedAddress: { type: String },
    },
    symptoms: { type: [String], default: [] },
    aiPredictions: { type: [AIPredictionSchema], default: [] },
    topPrediction: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    riskLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
    confidenceTier: {
      type: String,
      enum: ['HIGH_CONFIDENCE', 'MEDIUM_CONFIDENCE', 'LOW_CONFIDENCE'],
      required: true,
      default: 'HIGH_CONFIDENCE',
    },
    decisionStatus: {
      type: String,
      enum: [
        'AI_PROCESSING',
        'AI_ADVISORY',
        'CLARIFICATION_REQUIRED',
        'EXPERT_REVIEW',
        'EXPERT_CONFIRMED',
        'EXPERT_REJECTED',
        'LAB_REFERRAL',
        'RESOLVED',
      ],
      required: true,
      default: 'AI_ADVISORY',
      index: true,
    },
    expertStatus: {
      type: String,
      enum: ['none', 'pending', 'confirmed', 'rejected', 'referred_to_lab'],
      default: 'none',
    },
    expertId: { type: String },
    expertName: { type: String },
    expertDiagnosis: { type: String },
    expertSeverity: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] },
    expertNotes: { type: String },
    expertRecommendedAction: { type: String },
    farmerNotes: { type: String },
    clarificationQuestions: { type: [ClarificationQuestionSchema], default: [] },
    clarificationAnswers: { type: Schema.Types.Mixed, default: {} },
    finalDiagnosis: { type: String },
    finalConfidence: { type: Number },
    auditTrail: { type: [AuditTrailSchema], default: [] },
    resolvedAt: { type: Date },
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

export const DiagnosticCaseModel =
  mongoose.models.DiagnosticCase || mongoose.model<IDiagnosticCaseDocument>('DiagnosticCase', DiagnosticCaseSchema);
