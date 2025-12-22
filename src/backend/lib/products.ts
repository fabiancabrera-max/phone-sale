import { adminDb } from '@/backend/config/firebase-admin';
import { COLLECTIONS, ERROR_CODES } from '@/backend/config/constants';
import {
    Product,
    CreateProductInput,
    UpdateProductInput,
    PaginatedResponse,
    ProductStatus,
} from '@/backend/types';
import { Timestamp } from 'firebase-admin/firestore';
import { ValidationError } from '@/backend/utils/validation';

/**
 * Create a new product
 */
export async function createProduct(
    input: CreateProductInput,
    userId: string,
    customId?: string
): Promise<Product> {
    const productData: Omit<Product, 'id'> = {
        ...input,
        status: input.status || 'on_sale',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userId,
    };

    if (customId) {
        await adminDb.collection(COLLECTIONS.PRODUCTS).doc(customId).set(productData);

        return {
            id: customId,
            ...productData,
        };
    }

    const docRef = await adminDb.collection(COLLECTIONS.PRODUCTS).add(productData);

    return {
        id: docRef.id,
        ...productData,
    };
}

/**
 * Get product by ID
 */
export async function getProductById(productId: string): Promise<Product | null> {
    const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(productId);
    const doc = await docRef.get();

    if (!doc.exists) {
        return null;
    }

    return {
        id: doc.id,
        ...doc.data(),
    } as Product;
}

/**
 * Update product
 */
export async function updateProduct(
    productId: string,
    input: UpdateProductInput,
    userId: string
): Promise<Product> {
    const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(productId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new ValidationError('Product not found', ERROR_CODES.NOT_FOUND);
    }

    const existingProduct = doc.data() as Product;

    // Verify ownership
    if (existingProduct.createdBy !== userId) {
        throw new ValidationError(
            'Unauthorized to update this product',
            ERROR_CODES.FORBIDDEN
        );
    }

    const updateData: any = {
        ...input,
        updatedAt: Timestamp.now(),
    };

    // Handle nested specs update using dot notation to avoid overwriting the entire map
    if (input.specs) {
        delete updateData.specs;
        Object.entries(input.specs).forEach(([key, value]) => {
            if (value !== undefined) {
                updateData[`specs.${key}`] = value;
            }
        });
    }

    await docRef.update(updateData);

    return {
        ...existingProduct,
        ...input,
        // Manually merge specs for the return value
        specs: {
            ...existingProduct.specs,
            ...(input.specs || {}),
        },
        updatedAt: updateData.updatedAt,
        id: productId,
    } as Product;
}

/**
 * Delete product
 */
export async function deleteProduct(productId: string, userId: string): Promise<void> {
    const docRef = adminDb.collection(COLLECTIONS.PRODUCTS).doc(productId);
    const doc = await docRef.get();

    if (!doc.exists) {
        throw new ValidationError('Product not found', ERROR_CODES.NOT_FOUND);
    }

    const existingProduct = doc.data() as Product;

    // Verify ownership
    if (existingProduct.createdBy !== userId) {
        throw new ValidationError(
            'Unauthorized to delete this product',
            ERROR_CODES.FORBIDDEN
        );
    }

    await docRef.delete();
}

/**
 * Get all products with pagination
 */
export async function getProducts(
    limit: number = 20,
    startAfter?: string,
    status?: ProductStatus
): Promise<PaginatedResponse<Product>> {
    let query = adminDb
        .collection(COLLECTIONS.PRODUCTS)
        .orderBy('createdAt', 'desc')
        .limit(limit + 1); // Fetch one extra to check if there are more

    // Filter by status if provided
    if (status) {
        query = query.where('status', '==', status) as any;
    }

    // Start after cursor if provided
    if (startAfter) {
        const startDoc = await adminDb.collection(COLLECTIONS.PRODUCTS).doc(startAfter).get();
        if (startDoc.exists) {
            query = query.startAfter(startDoc) as any;
        }
    }

    const snapshot = await query.get();
    const products: Product[] = [];

    snapshot.forEach((doc) => {
        products.push({
            id: doc.id,
            ...doc.data(),
        } as Product);
    });

    // Check if there are more results
    const hasMore = products.length > limit;
    if (hasMore) {
        products.pop(); // Remove the extra item
    }

    const nextCursor = hasMore && products.length > 0 ? products[products.length - 1].id : undefined;

    return {
        items: products,
        nextCursor,
        hasMore,
    };
}

/**
 * Get products by user ID
 */
export async function getProductsByUser(
    userId: string,
    limit: number = 20,
    startAfter?: string
): Promise<PaginatedResponse<Product>> {
    let query = adminDb
        .collection(COLLECTIONS.PRODUCTS)
        .where('createdBy', '==', userId)
        .orderBy('createdAt', 'desc')
        .limit(limit + 1);

    if (startAfter) {
        const startDoc = await adminDb.collection(COLLECTIONS.PRODUCTS).doc(startAfter).get();
        if (startDoc.exists) {
            query = query.startAfter(startDoc) as any;
        }
    }

    const snapshot = await query.get();
    const products: Product[] = [];

    snapshot.forEach((doc) => {
        products.push({
            id: doc.id,
            ...doc.data(),
        } as Product);
    });

    const hasMore = products.length > limit;
    if (hasMore) {
        products.pop();
    }

    const nextCursor = hasMore && products.length > 0 ? products[products.length - 1].id : undefined;

    return {
        items: products,
        nextCursor,
        hasMore,
    };
}

/**
 * Search products by title
 */
export async function searchProducts(
    searchTerm: string,
    limit: number = 20
): Promise<Product[]> {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or Elasticsearch
    // This is a simple prefix search
    const snapshot = await adminDb
        .collection(COLLECTIONS.PRODUCTS)
        .where('status', '==', 'on_sale')
        .orderBy('title')
        .startAt(searchTerm)
        .endAt(searchTerm + '\uf8ff')
        .limit(limit)
        .get();

    const products: Product[] = [];

    snapshot.forEach((doc) => {
        products.push({
            id: doc.id,
            ...doc.data(),
        } as Product);
    });

    return products;
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    // This assumes you have a 'featured' field in your product
    // For now, we'll just return the latest published products
    const snapshot = await adminDb
        .collection(COLLECTIONS.PRODUCTS)
        .where('status', '==', 'featured')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

    const products: Product[] = [];

    snapshot.forEach((doc) => {
        products.push({
            id: doc.id,
            ...doc.data(),
        } as Product);
    });

    return products;
}
