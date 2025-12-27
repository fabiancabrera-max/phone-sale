import { NextRequest } from 'next/server';
import { requireAuth, optionalAuth } from '@/backend/middleware/auth';
import {
  createProduct,
  getProducts,
  getProductsByUser,
} from '@/backend/lib/products';
import { validateCreateProduct } from '@/backend/utils/validation';
import {
  successResponse,
  handleError,
  validateMethod,
  parseJsonBody,
  parsePaginationParams,
  getQueryParam,
} from '@/backend/utils/response';
import { SUCCESS_MESSAGES } from '@/backend/config/constants';
import { ProductStatus } from '@/backend/types';

/**
 * GET /api/products
 * Get all products with optional filtering and pagination
 *
 * Query params:
 * - limit: number (default: 20, max: 100)
 * - startAfter: string (document ID for pagination)
 * - status: 'draft' | 'published' | 'archived'
 * - userId: string (filter by user)
 *
 * Response:
 * - 200: { success: true, data: { items, nextCursor, hasMore } }
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);

    // Optional auth - allows both authenticated and public access
    const decodedToken = await optionalAuth(request);

    // Parse pagination params
    const { limit, startAfter } = parsePaginationParams(url);

    // Get filter params
    const status = getQueryParam(url, 'status') as ProductStatus | null;
    const userId = getQueryParam(url, 'userId');

    let result;

    if (userId) {
      // Get products by specific user
      // Only allow if authenticated and requesting own products, or if products are on_sale
      if (decodedToken?.uid !== userId && status !== 'on_sale') {
        // For other users, only show public products
        result = await getProducts(limit, startAfter, 'on_sale');
      } else {
        result = await getProductsByUser(userId, limit, startAfter);
      }
    } else {
      // Get all products
      // If not authenticated, only show public
      const filterStatus =
        !decodedToken && !status ? 'on_sale' : status || undefined;
      result = await getProducts(limit, startAfter, filterStatus);
    }

    return successResponse(result);
  } catch (error) {
    return handleError(error);
  }
}

/**
 * POST /api/products
 * Create a new product
 *
 * Request:
 * - Headers: Authorization: Bearer <firebase-id-token>
 * - Body: CreateProductInput
 *
 * Response:
 * - 201: { success: true, data: Product }
 * - 401: Unauthorized
 * - 400: Invalid input
 */
export async function POST(request: NextRequest) {
  try {
    // Validate method
    const methodError = validateMethod(request, ['POST']);
    if (methodError) return methodError;

    // Verify authentication
    const decodedToken = await requireAuth(request);
    const userId = decodedToken.uid;

    // Parse and validate body
    const body = (await parseJsonBody(request)) as Record<string, unknown>;
    const { id, ...input } = body;
    const validatedInput = validateCreateProduct(input);

    // Create product
    const product = await createProduct(
      validatedInput,
      userId,
      id as string | undefined
    );

    return successResponse(
      {
        message: SUCCESS_MESSAGES.PRODUCT_CREATED,
        product,
      },
      201
    );
  } catch (error) {
    return handleError(error);
  }
}
