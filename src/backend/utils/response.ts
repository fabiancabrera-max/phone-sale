import { NextResponse } from 'next/server';
import { ApiError, ApiSuccess } from '@/backend/types';
import { ERROR_CODES } from '@/backend/config/constants';
import { AuthError } from '@/backend/middleware/auth';
import { ValidationError } from '@/backend/utils/validation';
import { ImageError } from '@/backend/utils/image';

/**
 * Create success response
 */
export function successResponse<T>(
  data: T,
  status: number = 200
): NextResponse<ApiSuccess<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Create error response
 */
export function errorResponse(
  message: string,
  code: string = ERROR_CODES.INTERNAL_ERROR,
  status: number = 500,
  details?: unknown
): NextResponse<ApiError> {
  return NextResponse.json(
    {
      error: message,
      code,
      ...(details !== undefined && details !== null ? { details } : {}),
    },
    { status }
  );
}

/**
 * Handle errors and return appropriate response
 */
export function handleError(error: unknown): NextResponse<ApiError> {
  console.error('API Error:', error);

  // Authentication errors
  if (error instanceof AuthError) {
    const status = error.code === ERROR_CODES.FORBIDDEN ? 403 : 401;
    return errorResponse(error.message, error.code, status);
  }

  // Validation errors
  if (error instanceof ValidationError) {
    return errorResponse(error.message, error.code, 400, {
      field: error.field,
    });
  }

  // Image errors
  if (error instanceof ImageError) {
    let status = 500;
    if (error.code === ERROR_CODES.FILE_TOO_LARGE) status = 413;
    if (error.code === ERROR_CODES.INVALID_FILE_TYPE) status = 400;
    if (error.code === ERROR_CODES.QUOTA_EXCEEDED) status = 429;
    if (error.code === ERROR_CODES.NOT_FOUND) status = 404;
    if (error.code === ERROR_CODES.FORBIDDEN) status = 403;

    return errorResponse(error.message, error.code, status);
  }

  // Generic errors
  if (error instanceof Error) {
    return errorResponse(error.message, ERROR_CODES.INTERNAL_ERROR, 500);
  }

  // Unknown errors
  return errorResponse(
    'An unexpected error occurred',
    ERROR_CODES.INTERNAL_ERROR,
    500
  );
}

/**
 * Validate request method
 */
export function validateMethod(
  request: Request,
  allowedMethods: string[]
): NextResponse<ApiError> | null {
  if (!allowedMethods.includes(request.method)) {
    return errorResponse(
      `Method ${request.method} not allowed`,
      'METHOD_NOT_ALLOWED',
      405
    );
  }
  return null;
}

/**
 * Parse JSON body safely
 */
export async function parseJsonBody<T = unknown>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    throw new ValidationError('Invalid JSON in request body');
  }
}

/**
 * Get query parameter
 */
export function getQueryParam(url: URL, param: string): string | null {
  return url.searchParams.get(param);
}

/**
 * Get required query parameter
 */
export function getRequiredQueryParam(url: URL, param: string): string {
  const value = url.searchParams.get(param);
  if (!value) {
    throw new ValidationError(`Missing required query parameter: ${param}`);
  }
  return value;
}

/**
 * Parse pagination params
 */
export function parsePaginationParams(url: URL): {
  limit: number;
  startAfter?: string;
} {
  const limitParam = url.searchParams.get('limit');
  const startAfterParam = url.searchParams.get('startAfter');

  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new ValidationError('Limit must be between 1 and 100');
  }

  return {
    limit,
    ...(startAfterParam ? { startAfter: startAfterParam } : {}),
  };
}
