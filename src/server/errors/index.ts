/**
 * @file src/server/errors/index.ts
 * @description Standardized application and API error hierarchy for SopKit.
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, code: string = "INTERNAL_ERROR") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Too many requests. Please try again later.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
  }
}

export class SecurityError extends AppError {
  constructor(message: string = "Request blocked due to security policy violation.") {
    super(message, 403, "SECURITY_VIOLATION");
  }
}

export class ProcessingError extends AppError {
  constructor(message: string = "Failed to process the requested file or payload.") {
    super(message, 422, "PROCESSING_ERROR");
  }
}
