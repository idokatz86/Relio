/**
 * PsychoeducationCards — Pre-session educational content
 * 
 * Issue #120: Build pre-session psychoeducation cards
 * @see .github/agents/psychoeducation-agent.agent.md
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface PsychoeducationCardsProps {
  onComplete: () => void;
  onSkip: () => void;
}

const CARDS = [
  {
    emoji: '🌊',
    title: 'Emotional Flooding',
    body: 'When heart rate rises above 100 BPM during conflict, we lose access to our rational brain. Relio detects flooding patterns and suggests 20-minute breaks — not to avoid conflict, but to return to it effectively.',
    source: 'Gottman Institute',
  },
  {
    emoji: '🏇',
    title: 'The Four Horsemen',
    body: 'Criticism, contempt, defensiveness, and stonewalling predict relationship breakdown with 93% accuracy. Relio\'s AI identifies these patterns and helps translate them into healthier expressions.',
    source: 'Gottman, 1994',
  },
  {
    emoji: '💡',
    title: 'Bids for Connection',
    body: 'Partners make small "bids" for attention throughout the day. Turning toward these bids (responding positively) is the #1 predictor of relationship satisfaction. Relio helps you recognize and respond to bids.',
    source: 'Gottman, 1999',
  },
  {
    emoji: '🔄',
    title: 'The Pursue-Withdraw Cycle',
    body: 'One partner pursues (seeks connection through discussion) while the other withdraws (seeks space). Neither is wrong — but the cycle escalates. Relio helps both partners feel safe enough to break the pattern.',
    source: 'Emotionally Focused Therapy',
  },
];

const { width } = Dimensions.get('window');

export function PsychoeducationCards({ onComplete, onSkip }: PsychoeducationCardsProps) {
  const [current, setCurrent] = useState(0);
  const isLast = current === CARDS.length - 1;

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {CARDS.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.emoji}>{CARDS[current].emoji}</Text>
        <Text style={styles.title}>{CARDS[current].title}</Text>
        <Text style={styles.body}>{CARDS[current].body}</Text>
        <Text style={styles.source}>— {CARDS[current].source}</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => isLast ? onComplete() : setCurrent(c => c + 1)}
        >
          <Text style={styles.primaryText}>{isLast ? 'Start Mediating' : 'Next'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip tips</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 24, justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#E0E0D8' },
  dotActive: { backgroundColor: '#6B705C', width: 24 },
  card: { backgroundColor: '#fff', borderRadius: 24, padding: 32, borderWidth: 1, borderColor: '#E8E8E0', alignItems: 'center' },
  emoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#333', textAlign: 'center', marginBottom: 16 },
  body: { fontSize: 15, color: '#555', lineHeight: 24, textAlign: 'center', marginBottom: 16 },
  source: { fontSize: 12, color: '#BBB', fontStyle: 'italic' },
  buttons: { marginTop: 32, gap: 12 },
  primaryButton: { height: 56, borderRadius: 16, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center' },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  skipButton: { alignItems: 'center', paddingVertical: 8 },
  skipText: { fontSize: 14, color: '#999' },
});
