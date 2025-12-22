import { v4 as uuidv4 } from 'uuid';
import { adminStorage, adminDb } from '@/backend/config/firebase-admin';
import {
    MAX_IMAGE_SIZE_BYTES,
    ALLOWED_IMAGE_TYPES,
    MIME_TO_EXTENSION,
    COLLECTIONS,
    ERROR_CODES,
    MAX_IMAGES_PER_USER_PER_DAY,
} from '@/backend/config/constants';
import { ImageMetadata, ImageQuota, AllowedImageType } from '@/backend/types';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * Validate image file
 */
export function validateImageFile(file: File): void {
    // Check file size
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
        throw new ImageError(
            `File size exceeds maximum of ${MAX_IMAGE_SIZE_BYTES / 1024 / 1024}MB`,
            ERROR_CODES.FILE_TOO_LARGE
        );
    }

    // Check content type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type as AllowedImageType)) {
        throw new ImageError(
            `Invalid file type. Allowed types: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
            ERROR_CODES.INVALID_FILE_TYPE
        );
    }
}

/**
 * Generate secure storage path for image
 * Format: users/{userId}/{uuid}.{extension}
 */
export function generateStoragePath(contentType: string): string {
    const extension = MIME_TO_EXTENSION[contentType] || 'jpg';
    const filename = `${uuidv4()}.${extension}`;
    return `images/${filename}`;
}

/**
 * Upload image to Cloud Storage
 * Returns public URL
 */
export async function uploadImageToStorage(
    file: File,
    storagePath: string
): Promise<string> {
    try {
        const bucket = adminStorage.bucket();
        const fileBuffer = Buffer.from(await file.arrayBuffer());

        // Upload file
        const fileRef = bucket.file(storagePath);
        await fileRef.save(fileBuffer, {
            metadata: {
                contentType: file.type,
            },
            public: true, // Make file publicly accessible
        });

        // Get public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storagePath}`;

        return publicUrl;
    } catch (error) {
        console.error('Error uploading to storage:', error);
        throw new ImageError(
            'Failed to upload image to storage',
            ERROR_CODES.INTERNAL_ERROR
        );
    }
}

/**
 * Delete image from Cloud Storage
 */
export async function deleteImageFromStorage(storagePath: string): Promise<void> {
    try {
        const bucket = adminStorage.bucket();
        const fileRef = bucket.file(storagePath);
        await fileRef.delete();
    } catch (error) {
        console.error('Error deleting from storage:', error);
        // Don't throw - image might already be deleted
    }
}

/**
 * Save image metadata to Firestore
 */
export async function saveImageMetadata(
    userId: string,
    url: string,
    storagePath: string,
    contentType: string,
    size: number,
    productId?: string
): Promise<ImageMetadata> {
    const metadata: Record<string, any> = {
        url,
        storagePath,
        userId,
        contentType,
        size,
        uploadedAt: Timestamp.now(),
    };

    if (productId) {
        metadata.productId = productId;
    }

    const docRef = await adminDb.collection(COLLECTIONS.IMAGE_METADATA).add(metadata);

    return {
        id: docRef.id,
        ...(metadata as unknown as Omit<ImageMetadata, 'id'>),
    };
}

/**
 * Check and update user's daily image quota
 * Throws error if quota exceeded
 */
export async function checkAndUpdateQuota(userId: string): Promise<void> {
    const today = new Date().toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    const quotaRef = adminDb.collection(COLLECTIONS.IMAGE_QUOTA).doc(`${userId}_${today}`);

    await adminDb.runTransaction(async (transaction) => {
        const quotaDoc = await transaction.get(quotaRef);

        if (quotaDoc.exists) {
            const quota = quotaDoc.data() as ImageQuota;

            if (quota.count >= MAX_IMAGES_PER_USER_PER_DAY) {
                throw new ImageError(
                    `Daily upload limit of ${MAX_IMAGES_PER_USER_PER_DAY} images exceeded`,
                    ERROR_CODES.QUOTA_EXCEEDED
                );
            }

            // Increment count
            transaction.update(quotaRef, {
                count: quota.count + 1,
                updatedAt: Timestamp.now(),
            });
        } else {
            // Create new quota document
            const newQuota: ImageQuota = {
                userId,
                date: today,
                count: 1,
                updatedAt: Timestamp.now(),
            };
            transaction.set(quotaRef, newQuota);
        }
    });
}

/**
 * Get user's current quota usage for today
 */
export async function getUserQuota(userId: string): Promise<{ used: number; limit: number }> {
    const today = new Date().toISOString().split('T')[0];
    const quotaRef = adminDb.collection(COLLECTIONS.IMAGE_QUOTA).doc(`${userId}_${today}`);
    const quotaDoc = await quotaRef.get();

    if (quotaDoc.exists) {
        const quota = quotaDoc.data() as ImageQuota;
        return {
            used: quota.count,
            limit: MAX_IMAGES_PER_USER_PER_DAY,
        };
    }

    return {
        used: 0,
        limit: MAX_IMAGES_PER_USER_PER_DAY,
    };
}

/**
 * Delete image and its metadata
 */
export async function deleteImage(imageId: string, userId: string): Promise<void> {
    const imageRef = adminDb.collection(COLLECTIONS.IMAGE_METADATA).doc(imageId);
    const imageDoc = await imageRef.get();

    if (!imageDoc.exists) {
        throw new ImageError('Image not found', ERROR_CODES.NOT_FOUND);
    }

    const imageData = imageDoc.data() as ImageMetadata;

    // Verify ownership
    if (imageData.userId !== userId) {
        throw new ImageError('Unauthorized to delete this image', ERROR_CODES.FORBIDDEN);
    }

    // Delete from storage
    await deleteImageFromStorage(imageData.storagePath);

    // Delete metadata
    await imageRef.delete();
}

/**
 * Custom image error
 */
export class ImageError extends Error {
    constructor(
        message: string,
        public code: string = ERROR_CODES.INTERNAL_ERROR
    ) {
        super(message);
    }
}

/**
 * Delete all images associated with a product (Metadata and Storage)
 */
export async function deleteProductImages(productId: string): Promise<void> {
    try {
        const snapshot = await adminDb
            .collection(COLLECTIONS.IMAGE_METADATA)
            .where('productId', '==', productId)
            .get();

        const deletePromises = snapshot.docs.map(async (doc) => {
            const data = doc.data() as ImageMetadata;
            // Delete from storage
            if (data.storagePath) {
                await deleteImageFromStorage(data.storagePath);
            }
            // Delete metadata doc
            await doc.ref.delete();
        });

        await Promise.allSettled(deletePromises);
    } catch (error) {
        console.error('Error deleting product images:', error);
        // Don't throw, allow product deletion to proceed even if image cleanup fails partially
    }
}
