import mongoose, { Schema, Document } from 'mongoose';
import { IWeatherData } from '../types';

export interface IWeatherDataDocument extends Omit<IWeatherData, 'id' | '_id'>, Document {}

const WeatherDataSchema = new Schema<IWeatherDataDocument>(
  {
    location: {
      type: String,
      required: true,
      index: true,
    },
    district: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    temperature: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      required: true,
    },
    humidity: {
      type: Number,
      default: 50,
    },
    windSpeed: {
      type: Number,
      default: 10,
    },
    rainProbability: {
      type: Number,
      default: 0,
    },
    forecast: [
      {
        day: String,
        date: String,
        tempMax: Number,
        tempMin: Number,
        condition: String,
        rainChance: Number,
        precipitationSum: Number,
        weatherCode: Number,
        icon: String,
      },
    ],
    alerts: [
      {
        id: String,
        type: { type: String },
        severity: String,
        title: String,
        description: String,
        actionableStep: String,
      },
    ],
    sourceStatus: {
      type: String,
      enum: ['LIVE DATA', 'DEMO DATA', 'UNAVAILABLE'],
      default: 'LIVE DATA',
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
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

export const WeatherDataModel =
  mongoose.models.WeatherData || mongoose.model<IWeatherDataDocument>('WeatherData', WeatherDataSchema);
