/**
 * Auth Context — Clerk OIDC integration
 *
 * Wraps Clerk for auth state management across the app.
 * Provides sign-in, sign-out, token access, and user identity.
 *
 * Issue #152: Working authentication flow — App Store blocker
 */

import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-expo';
import { storeTokens, clearTokens } from '../services/token-manager';
import { setUserContext, clearUserContext } from '../services/sentry';

interface AuthContextType {
  isSignedIn: boolean;
  isLoading: boolean;
  userId: string | null;
  email: string | null;
  getToken: () => Promise<string | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isSignedIn: false,
  isLoading: true,
  userId: null,
  email: null,
  getToken: async () => null,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded, userId, getToken: clerkGetToken, signOut: clerkSignOut } = useClerkAuth();
  const { user } = useUser();
  const [tokenSynced, setTokenSynced] = useState(false);

  // Sync Clerk token to secure storage whenever auth state changes
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && userId) {
      (async () => {
        try {
          const token = await clerkGetToken();
          if (token) {
            await storeTokens({
              accessToken: token,
              expiresAt: Date.now() + 3600000, // 1h — Clerk auto-refreshes
              userId,
            });
            setUserContext(userId, 'en');
          }
        } catch {
          // Token sync failed — non-blocking
        }
        setTokenSynced(true);
      })();
    } else {
      setTokenSynced(true);
    }
  }, [isSignedIn, isLoaded, userId]);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!isSignedIn) return null;
    try {
      return await clerkGetToken();
    } catch {
      return null;
    }
  }, [isSignedIn, clerkGetToken]);

  const signOut = useCallback(async () => {
    await clerkSignOut();
    await clearTokens();
    clearUserContext();
  }, [clerkSignOut]);

  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  return (
    <AuthContext.Provider
      value={{
        isSignedIn: isSignedIn ?? false,
        isLoading: !isLoaded || !tokenSynced,
        userId: userId ?? null,
        email,
        getToken,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
