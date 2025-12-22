import { NextRequest } from 'next/server';
import { adminAuth } from '@/backend/config/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';
import { ERROR_CODES } from '@/backend/config/constants';

/**
 * Extract Firebase ID token from Authorization header
 */
export function extractToken(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
        return null;
    }

    // Expected format: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    return parts[1];
}

/**
 * Verify Firebase ID token and return decoded token
 * @throws Error if token is invalid or expired
 */
export async function verifyAuthToken(token: string): Promise<DecodedIdToken> {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Invalid or expired token');
    }
}

/**
 * Middleware to verify authentication
 * Returns decoded token if valid, throws error otherwise
 */
export async function requireAuth(request: NextRequest): Promise<DecodedIdToken> {
    const token = extractToken(request);

    if (!token) {
        throw new AuthError('No authentication token provided', ERROR_CODES.UNAUTHORIZED);
    }

    try {
        const decodedToken = await verifyAuthToken(token);
        return decodedToken;
    } catch (error) {
        throw new AuthError(
            'Authentication failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
            ERROR_CODES.UNAUTHORIZED
        );
    }
}

/**
 * Optional auth - returns decoded token if present, null otherwise
 * Does not throw error if no token provided
 */
export async function optionalAuth(request: NextRequest): Promise<DecodedIdToken | null> {
    const token = extractToken(request);

    if (!token) {
        return null;
    }

    try {
        const decodedToken = await verifyAuthToken(token);
        return decodedToken;
    } catch (error) {
        // Invalid token provided - treat as unauthenticated
        console.warn('Invalid token provided in optional auth:', error);
        return null;
    }
}

/**
 * Check if user has admin role
 * This is a placeholder - implement your own role checking logic
 */
export async function requireAdmin(decodedToken: DecodedIdToken): Promise<void> {
    // Option 1: Check custom claims
    if (decodedToken.admin !== true) {
        throw new AuthError('Admin access required', ERROR_CODES.FORBIDDEN);
    }

    // Option 2: Check against admin list in Firestore
    // const adminDoc = await adminDb.collection('admins').doc(decodedToken.uid).get();
    // if (!adminDoc.exists) {
    //   throw new AuthError('Admin access required', ERROR_CODES.FORBIDDEN);
    // }
}

/**
 * Custom authentication error
 */
export class AuthError extends Error {
    constructor(
        message: string,
        public code: string = ERROR_CODES.UNAUTHORIZED
    ) {
        super(message);
        this.name = 'AuthError';
    }
}
