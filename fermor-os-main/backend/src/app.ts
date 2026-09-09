import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { apiRoutes } from './routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';

const app: Express = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Root
app.get('/', (req, res) => {
  res.json({
    service: 'Farmer OS Core API',
    version: '1.0.0',
    status: 'online',
    docs: '/api/health',
  });
});

// Mount Central API Routes
app.use('/api', apiRoutes);

// Catch-all 404 & Centralized Error Handler
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
