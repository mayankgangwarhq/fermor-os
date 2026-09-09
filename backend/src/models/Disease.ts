import mongoose, { Schema, Document } from 'mongoose';
import { IDisease } from '../types';

export interface IDiseaseDocument extends Omit<IDisease, 'id' | '_id'>, Document {}

const DiseaseSchema = new Schema<IDiseaseDocument>(
  {
    cropName: {
      type: String,
      required: [true, 'Crop name is required'],
      index: true,
      trim: true,
    },
    diseaseName: {
      type: String,
      required: [true, 'Disease name is required'],
      trim: true,
    },
    scientificName: {
      type: String,
      default: '',
    },
    symptoms: {
      type: [String],
      default: [],
    },
    causes: {
      type: [String],
      default: [],
    },
    preventiveMeasures: {
      type: [String],
      default: [],
    },
    chemicalTreatments: {
      type: [String],
      default: [],
    },
    organicTreatments: {
      type: [String],
      default: [],
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'MEDIUM',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    seasonalOccurrence: {
      type: String,
      default: '',
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

export const DiseaseModel = mongoose.models.Disease || mongoose.model<IDiseaseDocument>('Disease', DiseaseSchema);
