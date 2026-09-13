import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current directory, parent directory, and backend directory
const candidatePaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'backend', '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];

for (const envFile of candidatePaths) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    break;
  }
}

export const maskMongoUri = (uri: string): string => {
  if (!uri) return 'NOT_CONFIGURED';
  return uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
};

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongodbUri: process.env.MONGODB_URI || '',
  jwtSecret: process.env.JWT_SECRET || 'farmer_os_jwt_default_secret_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  aiInferenceServiceUrl: process.env.AI_INFERENCE_SERVICE_URL || '',
  geminiApiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-3.5-flash',
  // Dedicated Crop Disease Vision Engine
  cropDiseaseProvider: process.env.CROP_DISEASE_PROVIDER || 'gemini',
  cropDiseaseApiKey: process.env.CROP_DISEASE_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '',
  cropDiseaseModel: process.env.CROP_DISEASE_MODEL || 'gemini-3.5-flash',
  // Mandi Rates Configuration (Auto-enables data_gov when DATA_GOV_API_KEY is present, with DEMO fallback)
  mandiProvider: process.env.MANDI_PROVIDER || (process.env.DATA_GOV_API_KEY ? 'data_gov' : 'demo'),
  dataGovApiKey: process.env.DATA_GOV_API_KEY || '',
};

