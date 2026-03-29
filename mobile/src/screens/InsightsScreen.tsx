/**
 * InsightsScreen — Communication Pattern Dashboard
 *
 * Sprint 16 / Issue #206.
 * Shows weekly pattern summaries, intensity trends, and conflict themes.
 * Gated to Plus tier ($4.99/mo) — free users see blurred preview.
 *
 * Survey: 40% of high-interest users want pattern tracking.
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, typography, borderRadius } from '../theme';
import {
  getWeeklyPattern,
  getPatternTrends,
  type WeeklyPattern,
  type TrendData,
} from '../services/api';

export function InsightsScreen() {
  const [weekly, setWeekly] = useState<WeeklyPattern | null>(null);
  const [trends, setTrends] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [w, t] = await Promise.all([getWeeklyPattern(), getPatternTrends()]);
      setWeekly(w);
      setTrends(t);
    } catch (err) {
      console.error('[Insights] Load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Your Communication Patterns</Text>
      <Text style={styles.subtitle}>
        Insights from your translations — only you see this.
      </Text>

      {/* Weekly Summary Card */}
      {weekly && (
        <View style={styles.weeklyCard}>
          <Text style={styles.cardTitle}>This Week</Text>
          <Text style={styles.summaryText}>{weekly.summary}</Text>

          {weekly.improvement !== null && (
            <View style={[
              styles.improvementBadge,
              weekly.improvement > 0 ? styles.improvementPositive : styles.improvementNegative,
            ]}>
              <Text style={styles.improvementText}>
                {weekly.improvement > 0 ? '↓' : '↑'} Intensity{' '}
                {Math.abs(weekly.improvement)}% vs last week
              </Text>
            </View>
          )}

          {/* Themes */}
          {weekly.themes.length > 0 && (
            <View style={styles.themesSection}>
              <Text style={styles.sectionLabel}>Top Themes</Text>
              <View style={styles.themeTags}>
                {weekly.themes.map((theme, i) => (
                  <View key={i} style={styles.themeTag}>
                    <Text style={styles.themeTagText}>{theme}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Horsemen detected */}
          {weekly.horsemen.length > 0 && (
            <View style={styles.horsemenSection}>
              <Text style={styles.sectionLabel}>Patterns Detected</Text>
              {weekly.horsemen.map((h, i) => (
                <View key={i} style={styles.horsemenTag}>
                  <Text style={styles.horsemenText}>
                    {h === 'criticism' && '⚡ Criticism — try leading with a need instead'}
                    {h === 'contempt' && '🔥 Contempt — the most corrosive pattern'}
                    {h === 'defensiveness' && '🛡️ Defensiveness — try owning your part'}
                    {h === 'stonewalling' && '🧊 Stonewalling — take a break, then come back'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{weekly.translationCount}</Text>
              <Text style={styles.statLabel}>Translations</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{weekly.avgIntensity}/10</Text>
              <Text style={styles.statLabel}>Avg Intensity</Text>
            </View>
          </View>
        </View>
      )}

      {/* 4-Week Trend */}
      {trends && trends.trends.length > 0 && (
        <View style={styles.trendsCard}>
          <Text style={styles.cardTitle}>4-Week Trend</Text>
          <View style={styles.trendChart}>
            {trends.trends.map((week, i) => {
              const maxIntensity = 10;
              const barHeight = week.avgIntensity > 0
                ? (week.avgIntensity / maxIntensity) * 80
                : 4;
              return (
                <View key={i} style={styles.trendColumn}>
                  <View style={styles.trendBarContainer}>
                    <View style={[
                      styles.trendBar,
                      {
                        height: barHeight,
                        backgroundColor: week.avgIntensity > 7
                          ? colors.safetyWarning
                          : week.avgIntensity > 4
                            ? colors.primaryLight
                            : colors.safetySafe,
                      },
                    ]} />
                  </View>
                  <Text style={styles.trendLabel}>{week.week.slice(5)}</Text>
                  <Text style={styles.trendCount}>{week.translationCount}</Text>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Empty state */}
      {(!weekly || weekly.translationCount === 0) && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>Your patterns will appear here</Text>
          <Text style={styles.emptyText}>
            Use the Translate tab to process a few conversations,
            and we'll start showing you patterns in your communication.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.xs },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.lg },
  // Weekly card
  weeklyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  summaryText: { ...typography.body, color: colors.text, lineHeight: 24, marginBottom: spacing.md },
  improvementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    marginBottom: spacing.md,
  },
  improvementPositive: { backgroundColor: colors.safetySafe + '20' },
  improvementNegative: { backgroundColor: colors.safetyWarning + '20' },
  improvementText: { ...typography.bodySmall, fontWeight: '600' },
  // Themes
  themesSection: { marginBottom: spacing.md },
  sectionLabel: { ...typography.bodySmall, color: colors.textSecondary, fontWeight: '600', marginBottom: spacing.xs },
  themeTags: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  themeTag: {
    backgroundColor: colors.primaryLight + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themeTagText: { ...typography.bodySmall, color: colors.primary },
  // Horsemen
  horsemenSection: { marginBottom: spacing.md },
  horsemenTag: {
    backgroundColor: colors.safetyWarning + '10',
    padding: spacing.sm,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  horsemenText: { ...typography.bodySmall, color: colors.text },
  // Stats
  statsRow: { flexDirection: 'row', gap: spacing.lg },
  stat: { alignItems: 'center' },
  statValue: { ...typography.h2, color: colors.primary },
  statLabel: { ...typography.bodySmall, color: colors.textSecondary },
  // Trends
  trendsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendChart: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120, marginTop: spacing.md },
  trendColumn: { alignItems: 'center', flex: 1 },
  trendBarContainer: { height: 80, justifyContent: 'flex-end' },
  trendBar: { width: 24, borderRadius: 4, minHeight: 4 },
  trendLabel: { ...typography.bodySmall, color: colors.textLight, fontSize: 10, marginTop: 4 },
  trendCount: { ...typography.bodySmall, color: colors.textSecondary, fontSize: 10 },
  // Empty
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius?.lg ?? 12,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyEmoji: { fontSize: 40, marginBottom: spacing.md },
  emptyTitle: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  emptyText: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
});
