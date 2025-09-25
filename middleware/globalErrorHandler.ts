// src/middleware/globalErrorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { AppError } from '../types/AppError';

export const globalErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
//   console.error('🔥 Error:', err);

  // Default response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  }

  // Handle Prisma known errors
  else if (err instanceof PrismaClientKnownRequestError) {
    isOperational = true;
    switch (err.code) {
      case 'P2002':
        statusCode = 400;
        message = `Unique constraint failed on field: ${(err.meta as any)?.target}`;
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      default:
        statusCode = 400;
        message = 'Prisma database error';
    }
  }

  // Handle Prisma validation errors
  else if (err instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Prisma validation error: ' + err.message;
    isOperational = true;
  }

  // Handle runtime errors
  else if (err instanceof TypeError || err instanceof ReferenceError || err instanceof SyntaxError) {
    statusCode = 500;
    message = err.message;
  }

  // Handle JWT errors
  else if ((err as any)?.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    isOperational = true;
  } 
  else if ((err as any)?.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
    isOperational = true;
  }

  // Handle validation libraries (Zod, Joi, etc.)
  else if ((err as any)?.issues) {
    statusCode = 400;
    message = 'Validation error';
    isOperational = true;
  }

  // Unknown errors
  else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    status: statusCode >= 500 ? 'error' : 'fail',
    message,
    isOperational,
    stack: process.env.NODE_ENV === 'development' ? (err as any).stack : undefined,
  });
};
