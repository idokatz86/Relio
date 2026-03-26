/**
 * Subscription Service — RevenueCat Integration
 * 
 * Manages in-app subscriptions via Apple App Store + Google Play.
 * RevenueCat handles: receipt validation, cross-platform sync,
 * free trials, and subscription status.
 * 
 * Setup:
 * 1. Create RevenueCat account at app.revenuecat.com
 * 2. Create a project, add iOS + Android apps
 * 3. Configure products in App Store Connect + Google Play Console
 * 4. Set REVENUECAT_API_KEY below (or via env)
 * 5. Create Entitlements: "premium_solo", "premium_couples", "premium_plus"
 * 6. Create Offerings with the subscription products
 */

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  PurchasesOffering,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// RevenueCat API keys — replace with your actual keys
const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || '';
const REVENUECAT_ANDROID_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || '';

// Entitlement identifiers (must match RevenueCat dashboard)
export const ENTITLEMENTS = {
  PREMIUM_COUPLES: 'premium_couples', // $19.99/mo
  PREMIUM_PLUS: 'premium_plus',       // $29.99/mo
} as const;

// Product identifiers (must match App Store Connect + Google Play Console)
export const PRODUCTS = {
  COUPLES_MONTHLY: 'relio_couples_monthly',     // $19.99/mo
  PLUS_MONTHLY: 'relio_plus_monthly',           // $29.99/mo
} as const;

export type SubscriptionTier = 'free' | 'couples' | 'plus';

export interface SubscriptionState {
  tier: SubscriptionTier;
  isActive: boolean;
  expirationDate: string | null;
  willRenew: boolean;
}

// ── Initialize ───────────────────────────────────────────

export async function initSubscriptions(userId: string): Promise<void> {
  const apiKey = Platform.OS === 'ios' ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;

  if (!apiKey) {
    console.log('[Subscriptions] No RevenueCat API key configured, skipping');
    return;
  }

  Purchases.setLogLevel(LOG_LEVEL.WARN);
  await Purchases.configure({ apiKey });

  // Associate with Relio user ID for cross-platform sync
  await Purchases.logIn(userId);
}

// ── Get Available Packages ───────────────────────────────

export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (err) {
    console.error('[Subscriptions] Failed to fetch offerings:', err);
    return null;
  }
}

// ── Purchase a Package ───────────────────────────────────

export async function purchasePackage(pkg: PurchasesPackage): Promise<{
  success: boolean;
  tier: SubscriptionTier;
  error?: string;
}> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const tier = getActiveTier(customerInfo);
    return { success: true, tier };
  } catch (err: any) {
    if (err.userCancelled) {
      return { success: false, tier: 'free', error: 'cancelled' };
    }
    return { success: false, tier: 'free', error: err.message };
  }
}

// ── Restore Purchases ────────────────────────────────────

export async function restorePurchases(): Promise<SubscriptionTier> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return getActiveTier(customerInfo);
  } catch {
    return 'free';
  }
}

// ── Check Current Subscription ───────────────────────────

export async function getSubscriptionState(): Promise<SubscriptionState> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const tier = getActiveTier(customerInfo);

    const activeEntitlement = Object.values(customerInfo.entitlements.active)[0];

    return {
      tier,
      isActive: tier !== 'free',
      expirationDate: activeEntitlement?.expirationDate || null,
      willRenew: activeEntitlement?.willRenew ?? false,
    };
  } catch {
    return { tier: 'free', isActive: false, expirationDate: null, willRenew: false };
  }
}

// ── Helper: Determine Active Tier ────────────────────────

function getActiveTier(customerInfo: CustomerInfo): SubscriptionTier {
  const active = customerInfo.entitlements.active;

  if (active[ENTITLEMENTS.PREMIUM_PLUS]) return 'plus';
  if (active[ENTITLEMENTS.PREMIUM_COUPLES]) return 'couples';
  return 'free';
}

// ── Feature Gating ───────────────────────────────────────

export function canAccess(feature: string, tier: SubscriptionTier): boolean {
  const access: Record<string, SubscriptionTier[]> = {
    'private_journal': ['free', 'couples', 'plus'],
    'attachment_quiz': ['free', 'couples', 'plus'],
    'ai_coaching': ['couples', 'plus'],
    'shared_chat': ['couples', 'plus'],
    'crisis_support': ['plus'],
    'priority_response': ['plus'],
    'psychoeducation': ['free', 'couples', 'plus'],
  };

  const allowed = access[feature];
  return allowed ? allowed.includes(tier) : false;
}
