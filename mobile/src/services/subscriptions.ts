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
// Sprint 15 pricing pivot (Issue #198): Free/$4.99/$9.99
export const ENTITLEMENTS = {
  PREMIUM_PLUS: 'premium_plus',       // $4.99/mo — unlimited translations + patterns
  PREMIUM_PRO: 'premium_pro',         // $9.99/mo — + attachment profiling, priority
} as const;

// Product identifiers (must match App Store Connect + Google Play Console)
export const PRODUCTS = {
  PLUS_MONTHLY: 'relio_plus_monthly_499',     // $4.99/mo
  PLUS_ANNUAL: 'relio_plus_annual_4999',      // $49.99/yr (save 17%)
  PRO_MONTHLY: 'relio_pro_monthly_999',       // $9.99/mo
  PRO_ANNUAL: 'relio_pro_annual_9999',        // $99.99/yr (save 17%)
} as const;

export type SubscriptionTier = 'free' | 'plus' | 'pro';

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

  if (active[ENTITLEMENTS.PREMIUM_PRO]) return 'pro';
  if (active[ENTITLEMENTS.PREMIUM_PLUS]) return 'plus';
  return 'free';
}

// ── Feature Gating ───────────────────────────────────────

export function canAccess(feature: string, tier: SubscriptionTier): boolean {
  const access: Record<string, SubscriptionTier[]> = {
    'private_journal': ['free', 'plus', 'pro'],
    'attachment_quiz': ['free', 'plus', 'pro'],
    'solo_translate': ['free', 'plus', 'pro'],      // free = 5/week limit
    'unlimited_translate': ['plus', 'pro'],
    'pattern_tracking': ['plus', 'pro'],
    'partner_invite': ['plus', 'pro'],
    'shared_chat': ['plus', 'pro'],
    'attachment_profiling': ['pro'],
    'priority_response': ['pro'],
    'psychoeducation': ['free', 'plus', 'pro'],
  };

  const allowed = access[feature];
  return allowed ? allowed.includes(tier) : false;
}
