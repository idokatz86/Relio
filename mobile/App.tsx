/**
 * Relio — AI Relationship Mediation App
 *
 * Entry point for iOS & Android (React Native / Expo).
 * Auth: Clerk OIDC → react-navigation stack/tab navigators.
 *
 * Issue #152: Clerk auth flow
 * Issue #153: React Navigation wiring (all screens)
 * Issue #157: Sentry crash reporting
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { AuthProvider } from './src/auth/AuthContext';
import { clerkTokenCache } from './src/auth/token-cache';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initSentry } from './src/services/sentry';
import { CLERK_PUBLISHABLE_KEY } from './src/services/api';
import { colors } from './src/theme';

export default function App() {
  useEffect(() => {
    initSentry();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ClerkProvider
          publishableKey={CLERK_PUBLISHABLE_KEY}
          tokenCache={clerkTokenCache}
        >
          <ClerkLoaded>
            <AuthProvider>
              <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
              <AppNavigator />
            </AuthProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
