import mongoose from 'mongoose';
import { config } from './env';

// Disable command buffering so disconnected queries fail fast or bypass to in-memory fallback
mongoose.set('bufferCommands', false);

let isConnected = false;

export const connectDatabase = async (): Promise<boolean> => {
  if (isConnected) {
    return true;
  }

  try {
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error: any) {
    console.warn(`[MongoDB] Connection notice: Unable to reach MongoDB at ${config.mongodbUri} (${error.message}). Running with in-memory service fallback mode.`);
    isConnected = false;
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export const getDbStatus = () => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'Disconnected',
    code: stateCode,
    host: mongoose.connection.host || 'N/A',
    database: mongoose.connection.name || 'N/A',
  };
};
