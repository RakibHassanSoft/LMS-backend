// src/middleware/notFound.ts
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/AppError';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  // Create a 404 AppError and pass to global error handler
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
};
