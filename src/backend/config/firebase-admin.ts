import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getStorage, Storage } from 'firebase-admin/storage';
import { getAuth, Auth } from 'firebase-admin/auth';

/**
 * Firebase Admin SDK singleton instance
 * Ensures only one instance is created across the application
 */
class FirebaseAdmin {
  private static instance: FirebaseAdmin;
  private app: App;
  private _firestore: Firestore | null = null;
  private _storage: Storage | null = null;
  private _auth: Auth | null = null;

  private constructor() {
    // Check if Firebase Admin is already initialized
    const apps = getApps();

    if (apps.length > 0) {
      this.app = apps[0];
    } else {
      // Initialize Firebase Admin with service account
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(
        /\\n/g,
        '\n'
      );

      if (
        !process.env.FIREBASE_PROJECT_ID ||
        !process.env.FIREBASE_CLIENT_EMAIL ||
        !privateKey
      ) {
        throw new Error(
          'Missing Firebase Admin credentials. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables.'
        );
      }

      this.app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey,
        }),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  /**
   * Get singleton instance
   */
  public static getInstance(): FirebaseAdmin {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }

  /**
   * Get Firestore instance
   */
  public get firestore(): Firestore {
    if (!this._firestore) {
      this._firestore = getFirestore(this.app);
    }
    return this._firestore;
  }

  /**
   * Get Storage instance
   */
  public get storage(): Storage {
    if (!this._storage) {
      this._storage = getStorage(this.app);
    }
    return this._storage;
  }

  /**
   * Get Auth instance
   */
  public get auth(): Auth {
    if (!this._auth) {
      this._auth = getAuth(this.app);
    }
    return this._auth;
  }
}

// Export singleton instances
const adminInstance = FirebaseAdmin.getInstance();

export const adminAuth = adminInstance.auth;
export const adminDb = adminInstance.firestore;
export const adminStorage = adminInstance.storage;

export default adminInstance;
