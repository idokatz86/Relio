/**
 * Clerk Token Cache — uses expo-secure-store
 *
 * Required by @clerk/clerk-expo for persistent auth sessions.
 * Stores Clerk's session tokens in the device's secure enclave.
 */

import * as SecureStore from 'expo-secure-store';
import type { TokenCache } from '@clerk/clerk-expo';

export const clerkTokenCache: TokenCache = {
  async getToken(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Non-critical — Clerk will re-auth on next launch
    }
  },
  async clearToken(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
  },
};
