/**
 * Language Picker Screen
 *
 * Issue #139: Add preferredLanguage to user profile + onboarding picker.
 * Shown during onboarding and accessible from Settings.
 * Changes both UI language (i18n) and AI mediation language.
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../i18n';
import { colors, spacing, typography, borderRadius } from '../theme';

interface LanguagePickerScreenProps {
  currentLanguage: string;
  onSelect: (languageCode: string) => void;
}

export function LanguagePickerScreen({ currentLanguage, onSelect }: LanguagePickerScreenProps) {
  const { t, i18n } = useTranslation();

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    onSelect(code);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('settings.language')}</Text>

      {supportedLanguages.map((lang) => {
        const isSelected = currentLanguage === lang.code;
        return (
          <TouchableOpacity
            key={lang.code}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => handleSelect(lang.code)}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.nativeName, isSelected && styles.textSelected]}>
                {lang.nativeName}
              </Text>
              <Text style={[styles.englishName, isSelected && styles.textSelectedSecondary]}>
                {lang.name}
              </Text>
            </View>
            {isSelected && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight || '#F0EDE6',
  },
  cardContent: {
    flex: 1,
  },
  nativeName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 2,
  },
  englishName: {
    ...typography.body,
    color: colors.textSecondary,
  },
  textSelected: {
    color: colors.primary,
  },
  textSelectedSecondary: {
    color: colors.primary,
    opacity: 0.8,
  },
  checkmark: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: '700',
  },
});
