/**
 * Application configuration constants
 */

// Image upload limits
export const MAX_IMAGE_SIZE_MB = parseInt(
  process.env.MAX_IMAGE_SIZE_MB || '5',
  10
);
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const MAX_IMAGES_PER_PRODUCT = parseInt(
  process.env.MAX_IMAGES_PER_PRODUCT || '5',
  10
);
export const MAX_IMAGES_PER_USER_PER_DAY = parseInt(
  process.env.MAX_IMAGES_PER_USER_PER_DAY || '50',
  10
);

// Allowed image MIME types
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

// File extension mapping
export const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

// Firestore collection names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  IMAGE_METADATA: 'image_metadata',
  IMAGE_QUOTA: 'image_quota',
} as const;

// Rate limiting (requests per time window)
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 60 * 1000, // 1 hour
  MAX_REQUESTS_PER_IP: 100,
  MAX_REQUESTS_PER_USER: 500,
} as const;

// Product validation
export const PRODUCT_VALIDATION = {
  MIN_TITLE_LENGTH: 3,
  MAX_TITLE_LENGTH: 100,
  MIN_DESCRIPTION_LENGTH: 10,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PRICE: 0,
  MAX_PRICE: 999999,
} as const;

// Pagination
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

// Storage paths
export const STORAGE_PATHS = {
  USERS: 'users',
  PRODUCTS: 'products',
} as const;

// Error codes
export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INVALID_INPUT: 'INVALID_INPUT',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PRODUCT_CREATED: 'Product created successfully',
  PRODUCT_UPDATED: 'Product updated successfully',
  PRODUCT_DELETED: 'Product deleted successfully',
  IMAGE_UPLOADED: 'Image uploaded successfully',
  IMAGE_DELETED: 'Image deleted successfully',
} as const;
