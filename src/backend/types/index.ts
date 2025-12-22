import { Timestamp } from 'firebase-admin/firestore';

/**
 * Product status
 */
export type ProductStatus = 'featured' | 'on_sale' | 'sold';

/**
 * Product condition codes
 */
export type ProductCondition = 'new' | 'used_as_new' | 'used' | 'refurbished';

/**
 * Product specifications
 */
export interface ProductSpecs {
    condition: ProductCondition;
    color: string;
    storage: string;
}

/**
 * Product interface for Firestore
 */
export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    specs: ProductSpecs;
    images: string[]; // Array of public CDN URLs (max 5)
    status: ProductStatus;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    createdBy: string; // User ID
}

/**
 * Product creation input (without auto-generated fields)
 */
export interface CreateProductInput {
    title: string;
    description: string;
    price: number;
    specs: ProductSpecs;
    images: string[]; // Max 5 URLs
    status?: ProductStatus; // Optional, defaults to 'on_sale'
}

/**
 * Product update input
 */
export interface UpdateProductInput {
    title?: string;
    description?: string;
    price?: number;
    specs?: Partial<ProductSpecs>; // Allow updating individual specs
    images?: string[];
    status?: ProductStatus;
}

/**
 * Image metadata stored in Firestore
 */
export interface ImageMetadata {
    id: string;
    url: string; // Public CDN URL
    storagePath: string; // users/{uid}/{uuid}.{ext}
    userId: string;
    productId?: string; // Optional - associated product
    contentType: string; // "image/jpeg", "image/png", "image/webp"
    size: number; // Bytes
    uploadedAt: Timestamp;
}

/**
 * Image upload response
 */
export interface ImageUploadResponse {
    url: string; // Public CDN URL
    storagePath: string;
    metadata: {
        contentType: string;
        size: number;
        uploadedAt: string;
    };
}

/**
 * Image quota tracking
 */
export interface ImageQuota {
    userId: string;
    date: string; // Format: "YYYY-MM-DD"
    count: number;
    updatedAt: Timestamp;
}

/**
 * Allowed image content types
 */
export const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
] as const;

export type AllowedImageType = (typeof ALLOWED_IMAGE_TYPES)[number];

/**
 * API Error response
 */
export interface ApiError {
    error: string;
    code: string;
    details?: unknown;
}

/**
 * API Success response
 */
export interface ApiSuccess<T = unknown> {
    success: true;
    data: T;
}

/**
 * Pagination params
 */
export interface PaginationParams {
    limit?: number;
    startAfter?: string; // Document ID
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    items: T[];
    nextCursor?: string;
    hasMore: boolean;
}
