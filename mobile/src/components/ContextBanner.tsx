/**
 * ContextBanner — Private/Shared Mode Indicator
 * 
 * Persistent, non-scrollable banner at the top of every screen.
 * Ensures users always know whether they're in Private (Tier 1) or Shared (Tier 3) mode.
 * 
 * Issue #91: Mobile navigation + ContextBanner
 * @see .github/agents/ui-ux-expert.agent.md — "Visual Demarcation"
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export type ContextMode = 'private' | 'shared';

interface ContextBannerProps {
  mode: ContextMode;
}

export function ContextBanner({ mode }: ContextBannerProps) {
  const isPrivate = mode === 'private';

  return (
    <View style={[styles.container, isPrivate ? styles.private : styles.shared]}>
      <Text style={[styles.icon]}>
        {isPrivate ? '🔒' : '👥'}
      </Text>
      <Text style={[styles.text, isPrivate ? styles.privateText : styles.sharedText]}>
        {isPrivate ? 'Only you see this' : 'Shared with partner'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  private: {
    backgroundColor: '#F5EDE6',
    borderWidth: 1,
    borderColor: '#E8DED5',
  },
  shared: {
    backgroundColor: '#E8F0E8',
    borderWidth: 1,
    borderColor: '#D4E4D4',
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  privateText: {
    color: '#8B7355',
  },
  sharedText: {
    color: '#4A6741',
  },
});
