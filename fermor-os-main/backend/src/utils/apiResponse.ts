import { Response } from 'express';
import { ApiResponse } from '../types';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response => {
  const response: ApiResponse<T> = {
    success: statusCode >= 200 && statusCode < 300,
    message,
    ...(data !== undefined && { data }),
  };
  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message: string = 'Request successful',
  statusCode: number = 200
): Response => {
  return sendResponse(res, statusCode, message, data);
};

export const sendCreated = <T>(
  res: Response,
  data: T,
  message: string = 'Resource created successfully'
): Response => {
  return sendResponse(res, 201, message, data);
};

export const sendError = (
  res: Response,
  message: string = 'An error occurred',
  statusCode: number = 500,
  errors?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  return res.status(statusCode).json(response);
};
