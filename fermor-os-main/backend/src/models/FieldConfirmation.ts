import mongoose, { Schema, Document } from 'mongoose';
import { IFieldConfirmation } from '../types';

export interface IFieldConfirmationDocument extends Omit<IFieldConfirmation, 'id' | '_id'>, Document {}

const FieldConfirmationSchema = new Schema<IFieldConfirmationDocument>(
  {
    caseId: { type: String, required: true },
    aiDiagnosis: { type: String, required: true },
    wasAiCorrect: {
      type: String,
      enum: ['Correct', 'Partially Correct', 'Incorrect'],
      required: true,
    },
    expertConfirmedDisease: { type: String, required: true },
    crop: { type: String, required: true },
    district: { type: String, default: 'Ludhiana' },
    state: { type: String, default: 'Punjab' },
    finalYieldImpact: { type: String, default: 'Minimal (< 5% loss)' },
    feedbackDate: { type: String, default: () => new Date().toISOString() },
    notes: { type: String, default: '' },
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

export const FieldConfirmationModel =
  mongoose.models.FieldConfirmation ||
  mongoose.model<IFieldConfirmationDocument>('FieldConfirmation', FieldConfirmationSchema);
