import dns from 'dns';
import mongoose from 'mongoose';
import { config, maskMongoUri } from './env';
import { seedInitialData } from './seed';

// Configure reliable DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Ignore if not supported in environment
}

// Connection event listeners
mongoose.connection.on('connected', () => {
  console.log(`[MongoDB] Connected successfully to Atlas Cluster: ${mongoose.connection.host}/${mongoose.connection.name}`);
});

mongoose.connection.on('error', (err) => {
  console.error('[MongoDB] Connection error event:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('[MongoDB] Disconnected from MongoDB cluster.');
});

export const connectDatabase = async (): Promise<boolean> => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  if (!config.mongodbUri) {
    console.warn('[MongoDB] MONGODB_URI is not set in environment variables.');
    return false;
  }

  try {
    const masked = maskMongoUri(config.mongodbUri);
    console.log(`[MongoDB] Connecting to: ${masked}...`);
    const conn = await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    });
    console.log(`[MongoDB] Connection established with database: ${conn.connection.name}`);
    
    // Run background initial seed check
    seedInitialData().catch((e) => console.warn('[MongoDB Seed Warning]', e.message));
    return true;
  } catch (error: any) {
    console.error(`[MongoDB] Connection error (${error.message}).`);
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

