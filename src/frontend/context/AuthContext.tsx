'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '@/frontend/config/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  getToken: async () => null,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      // Force refresh if needed, but usually strictly false is fine for performance
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, getToken, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
