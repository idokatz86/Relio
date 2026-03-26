/**
 * Crisis Screen — Locale-Aware Emergency Resources
 *
 * Issue #136: Shows country-specific crisis hotlines based on device locale.
 * Triggered when Safety Guardian issues a HALT.
 * NON-DISMISSABLE — the user must explicitly acknowledge before continuing.
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ScrollView,
  Platform,
  NativeModules,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';

interface CrisisScreenProps {
  severity: string;
  onAcknowledge: () => void;
}

// ── Locale-aware crisis resources (Issue #136) ───────────────
interface CrisisResource {
  name: string;
  description: string;
  phone: string;
  url: string;
}

interface LocaleResources {
  title: string;
  message: string;
  subtitle: string;
  acknowledge: string;
  returnButton: string;
  resources: CrisisResource[];
}

const RESOURCES_BY_LOCALE: Record<string, LocaleResources> = {
  en: {
    title: "We're here for you",
    message: 'Relio detected something that suggests you or someone you know may need support beyond what our AI can provide.',
    subtitle: "You're not alone. Please reach out to one of these resources:",
    acknowledge: 'I have reviewed these resources and feel safe to continue',
    returnButton: 'Return to app',
    resources: [
      { name: '988 Suicide & Crisis Lifeline', description: 'Call or text 988 — free, 24/7 support', phone: '988', url: 'tel:988' },
      { name: 'National DV Hotline', description: 'Call 1-800-799-7233 or text START to 88788', phone: '1-800-799-7233', url: 'tel:18007997233' },
      { name: 'Crisis Text Line', description: 'Text HOME to 741741', phone: '741741', url: 'sms:741741&body=HOME' },
    ],
  },
  es: {
    title: 'Estamos aquí para ti',
    message: 'Relio detectó algo que sugiere que tú o alguien que conoces puede necesitar apoyo más allá de lo que nuestra IA puede ofrecer.',
    subtitle: 'No estás solo/a. Por favor contacta uno de estos recursos:',
    acknowledge: 'He revisado estos recursos y me siento seguro/a para continuar',
    returnButton: 'Volver a la app',
    resources: [
      { name: 'Línea de Crisis 988', description: 'Llama o envía texto al 988 — gratis, 24/7', phone: '988', url: 'tel:988' },
      { name: 'Línea Nacional de Violencia Doméstica', description: 'Llama al 1-800-799-7233 (español disponible)', phone: '1-800-799-7233', url: 'tel:18007997233' },
      { name: 'Línea de Texto de Crisis', description: 'Envía HOLA al 741741', phone: '741741', url: 'sms:741741&body=HOLA' },
    ],
  },
  pt: {
    title: 'Estamos aqui para você',
    message: 'O Relio detectou algo que sugere que você ou alguém que você conhece pode precisar de apoio além do que nossa IA pode oferecer.',
    subtitle: 'Você não está sozinho/a. Entre em contato com um destes recursos:',
    acknowledge: 'Revisei esses recursos e me sinto seguro/a para continuar',
    returnButton: 'Voltar ao app',
    resources: [
      { name: 'CVV — Centro de Valorização da Vida', description: 'Ligue 188 — gratuito, 24h', phone: '188', url: 'tel:188' },
      { name: 'Ligue 180 — Violência contra a Mulher', description: 'Central de Atendimento — 24h, gratuito', phone: '180', url: 'tel:180' },
      { name: 'SAMU', description: 'Emergência médica — 192', phone: '192', url: 'tel:192' },
    ],
  },
  he: {
    title: 'אנחנו כאן בשבילך',
    message: 'Relio זיהה משהו שמצביע על כך שאתה או מישהו שאתה מכיר עשוי להזדקק לתמיכה מעבר למה שהבינה המלאכותית שלנו יכולה לספק.',
    subtitle: 'אתה לא לבד. אנא פנה לאחד מהמשאבים הבאים:',
    acknowledge: 'עברתי על המשאבים ואני מרגיש/ה בטוח/ה להמשיך',
    returnButton: 'חזרה לאפליקציה',
    resources: [
      { name: 'ער"ן — עזרה ראשונה נפשית', description: 'טלפון 1201 — חינם, 24/7', phone: '1201', url: 'tel:1201' },
      { name: 'קו חירום לנשים מוכות', description: 'טלפון 1-800-353-300 — חינם', phone: '1-800-353-300', url: 'tel:1800353300' },
      { name: 'נט"ל — קו הסיוע והייעוץ', description: 'טלפון *2784 — חינם', phone: '*2784', url: 'tel:*2784' },
    ],
  },
};

/**
 * Get device locale prefix (e.g., 'en', 'es', 'he').
 */
function getDeviceLocale(): string {
  try {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale ||
          NativeModules.SettingsManager?.settings?.AppleLanguages?.[0]
        : NativeModules.I18nManager?.localeIdentifier;
    return (locale || 'en').split(/[-_]/)[0].toLowerCase();
  } catch {
    return 'en';
  }
}

export function CrisisScreen({ severity, onAcknowledge }: CrisisScreenProps) {
  const [acknowledged, setAcknowledged] = useState(false);

  const locale = useMemo(() => getDeviceLocale(), []);
  const content = RESOURCES_BY_LOCALE[locale] || RESOURCES_BY_LOCALE.en;
  const isRTL = locale === 'he' || locale === 'ar';

  const handleCall = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Shield icon */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🛡️</Text>
        </View>

        <Text style={[styles.title, isRTL && styles.rtlText]}>{content.title}</Text>

        <Text style={[styles.message, isRTL && styles.rtlText]}>
          {content.message}
        </Text>

        <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
          {content.subtitle}
        </Text>

        {/* Crisis resources */}
        {content.resources.map((resource) => (
          <TouchableOpacity
            key={resource.name}
            style={styles.resourceCard}
            onPress={() => handleCall(resource.url)}
            accessibilityLabel={`Call ${resource.name}: ${resource.description}`}
            accessibilityRole="button"
            accessibilityHint="Opens phone dialer or external link"
          >
            <Text style={styles.resourceName}>{resource.name}</Text>
            <Text style={styles.resourceDesc}>{resource.description}</Text>
            <Text style={styles.resourceAction}>Tap to connect →</Text>
          </TouchableOpacity>
        ))}

        {/* Non-dismissable: must check acknowledgment first */}
        <View style={styles.acknowledgmentSection}>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAcknowledged(!acknowledged)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: acknowledged }}
            accessibilityLabel="I acknowledge the crisis resources above"
          >
            <View style={[styles.checkbox, acknowledged && styles.checkboxChecked]}>
              {acknowledged && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.checkboxLabel, isRTL && styles.rtlText]}>
              {content.acknowledge}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.continueButton, !acknowledged && styles.continueButtonDisabled]}
            onPress={onAcknowledge}
            disabled={!acknowledged}
            accessibilityLabel="Return to chat"
            accessibilityRole="button"
            accessibilityState={{ disabled: !acknowledged }}
          >
            <Text style={styles.continueButtonText}>{content.returnButton}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },
  subtitle: {
    ...typography.label,
    color: colors.text,
    marginBottom: spacing.md,
  },
  resourceCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.safetyHalt,
  },
  resourceName: {
    ...typography.h3,
    color: colors.safetyHalt,
    marginBottom: spacing.xs,
  },
  resourceDesc: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  resourceAction: {
    ...typography.label,
    color: colors.safetyHalt,
  },
  acknowledgmentSection: {
    marginTop: spacing.xl,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkboxLabel: {
    ...typography.body,
    color: colors.text,
    flex: 1,
  },
  continueButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: colors.disabled,
  },
  continueButtonText: {
    ...typography.label,
    color: colors.white,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});
