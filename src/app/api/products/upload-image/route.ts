import { NextRequest } from 'next/server';
import { requireAuth } from '@/backend/middleware/auth';
import {
  validateImageFile,
  generateStoragePath,
  uploadImageToStorage,
  saveImageMetadata,
  checkAndUpdateQuota,
  getUserQuota,
} from '@/backend/utils/image';
import {
  successResponse,
  errorResponse,
  handleError,
  validateMethod,
} from '@/backend/utils/response';
import { ImageUploadResponse } from '@/backend/types';

/**
 * POST /api/products/upload-image
 * Upload a product image to Cloud Storage
 *
 * Request:
 * - Headers: Authorization: Bearer <firebase-id-token>
 * - Body: FormData with 'image' file
 * - Optional: productId in FormData
 *
 * Response:
 * - 200: { success: true, data: { url, storagePath, metadata } }
 * - 401: Unauthorized
 * - 400: Invalid file
 * - 413: File too large
 * - 429: Quota exceeded
 */
export async function POST(request: NextRequest) {
  try {
    // Validate method
    const methodError = validateMethod(request, ['POST']);
    if (methodError) return methodError;

    // Verify authentication
    const decodedToken = await requireAuth(request);
    const userId = decodedToken.uid;

    // Check quota before processing file
    const quota = await getUserQuota(userId);
    if (quota.used >= quota.limit) {
      return errorResponse(
        `Daily upload limit of ${quota.limit} images exceeded. Used: ${quota.used}/${quota.limit}`,
        'QUOTA_EXCEEDED',
        429,
        { quota }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const productId = formData.get('productId') as string | null;

    if (!file) {
      return errorResponse('No image file provided', 'INVALID_INPUT', 400);
    }

    // Validate file
    validateImageFile(file);

    // Check and update quota (atomic operation)
    await checkAndUpdateQuota(userId);

    // Generate secure storage path
    const storagePath = generateStoragePath(file.type);

    // Upload to Cloud Storage
    const publicUrl = await uploadImageToStorage(file, storagePath);

    // Save metadata to Firestore
    const metadata = await saveImageMetadata(
      userId,
      publicUrl,
      storagePath,
      file.type,
      file.size,
      productId || undefined
    );

    // Prepare response
    const response: ImageUploadResponse = {
      url: publicUrl,
      storagePath,
      metadata: {
        contentType: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(),
      },
    };

    return successResponse(response, 201);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * GET /api/products/upload-image
 * Get user's current upload quota
 *
 * Response:
 * - 200: { success: true, data: { used, limit, remaining } }
 */
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const decodedToken = await requireAuth(request);
    const userId = decodedToken.uid;

    // Get quota
    const quota = await getUserQuota(userId);

    return successResponse({
      used: quota.used,
      limit: quota.limit,
      remaining: quota.limit - quota.used,
    });
  } catch (error) {
    return handleError(error);
  }
}
