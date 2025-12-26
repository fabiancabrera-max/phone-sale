import { NextRequest } from 'next/server';
import { requireAuth, optionalAuth } from '@/backend/middleware/auth';
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from '@/backend/lib/products';
import { validateUpdateProduct } from '@/backend/utils/validation';
import {
  successResponse,
  errorResponse,
  handleError,
  validateMethod,
  parseJsonBody,
} from '@/backend/utils/response';
import { SUCCESS_MESSAGES, ERROR_CODES } from '@/backend/config/constants';
import { deleteProductImages } from '@/backend/utils/image';

/**
 * GET /api/products/[id]
 * Get a single product by ID
 *
 * Response:
 * - 200: { success: true, data: Product }
 * - 404: Product not found
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: productId } = await context.params;

    // Optional auth - allows both authenticated and public access
    const decodedToken = await optionalAuth(request);

    const product = await getProductById(productId);

    if (!product) {
      return errorResponse('Product not found', ERROR_CODES.NOT_FOUND, 404);
    }

    // If product is not published, only owner can view
    if (
      !['on_sale', 'featured'].includes(product.status) &&
      product.createdBy !== decodedToken?.uid
    ) {
      return errorResponse('Product not found', ERROR_CODES.NOT_FOUND, 404);
    }

    return successResponse(product);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/products/[id]
 * Update a product
 *
 * Request:
 * - Headers: Authorization: Bearer <firebase-id-token>
 * - Body: UpdateProductInput
 *
 * Response:
 * - 200: { success: true, data: Product }
 * - 401: Unauthorized
 * - 403: Forbidden (not owner)
 * - 404: Product not found
 * - 400: Invalid input
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Validate method
    const methodError = validateMethod(request, ['PUT']);
    if (methodError) return methodError;

    const { id: productId } = await context.params;

    // Verify authentication
    const decodedToken = await requireAuth(request);
    const userId = decodedToken.uid;

    // Parse and validate body
    const body = await parseJsonBody(request);
    const validatedInput = validateUpdateProduct(body);

    // Update product
    const product = await updateProduct(productId, validatedInput, userId);

    return successResponse({
      message: SUCCESS_MESSAGES.PRODUCT_UPDATED,
      product,
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product and its associated images
 *
 * Request:
 * - Headers: Authorization: Bearer <firebase-id-token>
 *
 * Response:
 * - 200: { success: true, data: { message } }
 * - 401: Unauthorized
 * - 403: Forbidden (not owner)
 * - 404: Product not found
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Validate method
    const methodError = validateMethod(request, ['DELETE']);
    if (methodError) return methodError;

    const { id: productId } = await context.params;

    // Verify authentication
    const decodedToken = await requireAuth(request);
    const userId = decodedToken.uid;

    // Get product to access images
    const product = await getProductById(productId);

    if (!product) {
      return errorResponse('Product not found', ERROR_CODES.NOT_FOUND, 404);
    }

    // Verify ownership
    if (product.createdBy !== userId) {
      return errorResponse(
        'Unauthorized to delete this product',
        ERROR_CODES.FORBIDDEN,
        403
      );
    }

    // Delete associated images from storage
    // Extract storage paths from image URLs
    // Delete associated images (metadata and storage)
    await deleteProductImages(productId);

    // Delete product
    await deleteProduct(productId, userId);

    return successResponse({
      message: SUCCESS_MESSAGES.PRODUCT_DELETED,
    });
  } catch (error) {
    return handleError(error);
  }
}
