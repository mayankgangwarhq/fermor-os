import mongoose, { Schema, Document } from 'mongoose';
import { IScheme } from '../types';

export interface ISchemeDocument extends Omit<IScheme, 'id' | '_id'>, Document {}

const SchemeSchema = new Schema<ISchemeDocument>(
  {
    title: {
      type: String,
      required: [true, 'Scheme title is required'],
      unique: true,
      trim: true,
    },
    titleHi: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: ['direct_benefit', 'subsidy', 'insurance', 'infrastructure', 'credit'],
      default: 'subsidy',
      index: true,
    },
    sponsor: {
      type: String,
      enum: ['Central Govt', 'State Govt', 'NABARD', 'Joint'],
      default: 'Central Govt',
      index: true,
    },
    benefitSummary: {
      type: String,
      required: true,
    },
    benefitSummaryHi: {
      type: String,
      default: '',
    },
    eligibilityCriteria: {
      type: [String],
      default: [],
    },
    documentsRequired: {
      type: [String],
      default: [],
    },
    subsidyPercentage: {
      type: Number,
      default: 0,
    },
    maxFinancialAssistance: {
      type: String,
      default: '',
    },
    applicationUrl: {
      type: String,
      default: 'https://pmkisan.gov.in',
    },
    applicationDeadline: {
      type: String,
      default: 'Ongoing Scheme',
    },
    active: {
      type: Boolean,
      default: true,
      index: true,
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

export const SchemeModel =
  mongoose.models.Scheme || mongoose.model<ISchemeDocument>('Scheme', SchemeSchema);
