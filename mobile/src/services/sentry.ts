/**
 * Sentry Configuration for Relio Mobile
 * 
 * Issue #157: Crash reporting integration
 * 
 * Setup:
 * 1. Create a Sentry project at sentry.io (React Native)
 * 2. Replace SENTRY_DSN below with your actual DSN
 * 3. Source maps are uploaded automatically via EAS build hooks
 */

import * as Sentry from '@sentry/react-native';

const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN || '';

export function initSentry(): void {
  if (!SENTRY_DSN) {
    console.log('[Sentry] No DSN configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: __DEV__ ? 'development' : 'production',
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
    attachScreenshot: true,
    enableAutoSessionTracking: true,
    sessionTrackingIntervalMillis: 30000,
    beforeSend(event) {
      // Scrub PII from crash reports — Tier 1 data must never leak
      if (event.extra) {
        delete event.extra['journal'];
        delete event.extra['privateMessage'];
        delete event.extra['tier1'];
      }
      return event;
    },
  });
}

export function setUserContext(userId: string, locale: string): void {
  Sentry.setUser({ id: userId });
  Sentry.setTag('locale', locale);
}

export function clearUserContext(): void {
  Sentry.setUser(null);
}

export function captureScreenTransition(screenName: string): void {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Screen: ${screenName}`,
    level: 'info',
  });
}

export { Sentry };
