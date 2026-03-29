/**
 * PaywallScreen — Subscription Selection
 * 
 * Shows available subscription plans from RevenueCat.
 * Handles: purchase, restore, and plan comparison.
 * Uses Apple IAP / Google Play Billing via RevenueCat SDK.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { PurchasesPackage } from 'react-native-purchases';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
  type SubscriptionTier,
} from '../services/subscriptions';
import { colors, spacing, typography } from '../theme';

interface PaywallScreenProps {
  onSubscribed: (tier: SubscriptionTier) => void;
  onSkip: () => void;
  onRestore: () => void;
}

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: '5 translations per week',
    features: ['5 solo translations/week', 'Private journal', 'Attachment quiz', 'Psychoeducation'],
    highlight: false,
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$4.99/mo',
    description: 'Unlimited translations + partner invite',
    features: ['Unlimited translations', 'Communication patterns', 'Partner invite', 'SharedChat mediation'],
    highlight: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99/mo',
    description: 'Full insights + priority',
    features: ['Everything in Plus', 'Attachment profiling', 'Priority AI response', 'Multi-language'],
    highlight: false,
  },
];

export function PaywallScreen({ onSubscribed, onSkip, onRestore }: PaywallScreenProps) {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('couples');

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offering = await getOfferings();
      if (offering) {
        setPackages(offering.availablePackages);
      }
    } catch (err) {
      console.error('[Paywall] Failed to load offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    const pkg = packages.find((p) =>
      p.identifier.toLowerCase().includes(selectedPlan)
    );

    if (!pkg) {
      Alert.alert('Not available', 'This plan is not yet available. Please try again later.');
      return;
    }

    setPurchasing(true);
    const result = await purchasePackage(pkg);
    setPurchasing(false);

    if (result.success) {
      onSubscribed(result.tier);
    } else if (result.error && result.error !== 'cancelled') {
      Alert.alert('Purchase failed', result.error);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    const tier = await restorePurchases();
    setLoading(false);

    if (tier !== 'free') {
      onSubscribed(tier);
    } else {
      Alert.alert('No purchases found', 'We couldn\'t find any previous subscriptions for this account.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Choose Your Plan</Text>
      <Text style={styles.subtitle}>
        Start free. Upgrade when you're ready.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <>
          <View style={styles.plans}>
            {PLANS.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                  plan.highlight && styles.planCardHighlight,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
                accessibilityLabel={`${plan.name} plan, ${plan.price}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: selectedPlan === plan.id }}
              >
                {plan.highlight && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planPrice}>{plan.price}</Text>
                <Text style={styles.planDesc}>{plan.description}</Text>
                <View style={styles.features}>
                  {plan.features.map((f) => (
                    <Text key={f} style={styles.feature}>✓ {f}</Text>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.subscribeButton, purchasing && styles.buttonDisabled]}
            onPress={handlePurchase}
            disabled={purchasing}
            accessibilityLabel="Subscribe now"
            accessibilityRole="button"
          >
            {purchasing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.subscribeText}>Subscribe Now</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={onSkip}
              accessibilityLabel="Continue with free plan"
              accessibilityRole="button"
            >
              <Text style={styles.skipText}>Continue with Free Plan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRestore}
              accessibilityLabel="Restore previous purchases"
              accessibilityRole="button"
            >
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legal}>
            Payment will be charged to your App Store or Google Play account.
            Subscription auto-renews monthly unless cancelled at least 24 hours
            before the end of the current period. Manage subscriptions in your
            device settings.
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },
  content: { padding: 24, paddingBottom: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#2D2D2D', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#8B8B80', textAlign: 'center', marginTop: 8, marginBottom: 24 },

  plans: { gap: 16 },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: '#E8E6DC',
  },
  planCardSelected: {
    borderColor: '#6B705C',
    backgroundColor: '#FAFAF5',
  },
  planCardHighlight: {
    borderColor: '#B2AC88',
  },
  popularBadge: {
    backgroundColor: '#B2AC88',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  planName: { fontSize: 20, fontWeight: '700', color: '#2D2D2D' },
  planPrice: { fontSize: 24, fontWeight: '800', color: '#6B705C', marginTop: 4 },
  planDesc: { fontSize: 13, color: '#8B8B80', marginTop: 4 },
  features: { marginTop: 12, gap: 6 },
  feature: { fontSize: 13, color: '#4A4A4A' },

  subscribeButton: {
    backgroundColor: '#6B705C',
    height: 54,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  subscribeText: { color: '#fff', fontSize: 17, fontWeight: '700' },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  skipText: { color: '#8B8B80', fontSize: 14 },
  restoreText: { color: '#6B705C', fontSize: 14, fontWeight: '600' },

  legal: {
    fontSize: 11,
    color: '#BBBBB0',
    textAlign: 'center',
    marginTop: 24,
    lineHeight: 16,
  },
});
