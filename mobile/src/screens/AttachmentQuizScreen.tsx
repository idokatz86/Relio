/**
 * AttachmentQuizScreen — 5-question attachment style assessment
 * 
 * Issue #115: Build attachment quiz (5 questions + result screen)
 * @see .github/agents/individual-profiler.agent.md
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface AttachmentQuizScreenProps {
  onComplete: (style: string) => void;
  onSkip: () => void;
}

const QUESTIONS = [
  {
    q: 'When your partner is upset, your instinct is to:',
    options: [
      { text: 'Move closer and ask what\'s wrong', style: 'anxious' },
      { text: 'Give them space until they\'re ready', style: 'avoidant' },
      { text: 'Check in calmly and offer support', style: 'secure' },
      { text: 'Feel overwhelmed and unsure what to do', style: 'disorganized' },
    ],
  },
  {
    q: 'In a disagreement, you tend to:',
    options: [
      { text: 'Keep bringing it up until it\'s resolved', style: 'anxious' },
      { text: 'Shut down or withdraw', style: 'avoidant' },
      { text: 'Take a break and revisit when calm', style: 'secure' },
      { text: 'Swing between confronting and withdrawing', style: 'disorganized' },
    ],
  },
  {
    q: 'When apart from your partner, you:',
    options: [
      { text: 'Check your phone frequently for messages', style: 'anxious' },
      { text: 'Enjoy the independence', style: 'avoidant' },
      { text: 'Feel connected even at a distance', style: 'secure' },
      { text: 'Alternate between missing them and relief', style: 'disorganized' },
    ],
  },
  {
    q: 'Emotional vulnerability feels:',
    options: [
      { text: 'Natural — I share easily (maybe too easily)', style: 'anxious' },
      { text: 'Uncomfortable — I prefer to handle things alone', style: 'avoidant' },
      { text: 'Important but requires trust', style: 'secure' },
      { text: 'Terrifying but I crave it', style: 'disorganized' },
    ],
  },
  {
    q: 'Your biggest relationship fear is:',
    options: [
      { text: 'Being abandoned or not enough', style: 'anxious' },
      { text: 'Losing my independence or being controlled', style: 'avoidant' },
      { text: 'Not being able to work through challenges together', style: 'secure' },
      { text: 'Both closeness and distance feel unsafe', style: 'disorganized' },
    ],
  },
];

const RESULTS: Record<string, { title: string; emoji: string; description: string; color: string }> = {
  anxious: { title: 'Anxious Attachment', emoji: '💙', description: 'You crave closeness and reassurance. Your superpower is emotional attunement — you pick up on subtle cues others miss. Relio helps you express needs without anxiety.', color: '#4A90D9' },
  avoidant: { title: 'Avoidant Attachment', emoji: '🛡️', description: 'You value independence and self-reliance. Your superpower is emotional stability under pressure. Relio helps you stay connected without feeling overwhelmed.', color: '#6B705C' },
  secure: { title: 'Secure Attachment', emoji: '💚', description: 'You balance closeness and independence naturally. You\'re comfortable with vulnerability and trust. Relio enhances your already strong communication foundation.', color: '#7FB069' },
  disorganized: { title: 'Disorganized Attachment', emoji: '🌊', description: 'You experience conflicting needs for closeness and distance. This often comes from complex experiences. Relio provides structure and safety for navigating this.', color: '#B08968' },
};

export function AttachmentQuizScreen({ onComplete, onSkip }: AttachmentQuizScreenProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (style: string) => {
    const newAnswers = [...answers, style];
    setAnswers(newAnswers);

    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
    } else {
      // Calculate dominant style
      const counts: Record<string, number> = {};
      newAnswers.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      setResult(dominant);
    }
  };

  if (result) {
    const r = RESULTS[result];
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.resultContent}>
          <Text style={styles.resultEmoji}>{r.emoji}</Text>
          <Text style={[styles.resultTitle, { color: r.color }]}>{r.title}</Text>
          <Text style={styles.resultDesc}>{r.description}</Text>
          <Text style={styles.disclaimer}>
            This is a brief screen, not a clinical diagnosis. Your attachment style can shift over time and across relationships.
          </Text>
        </ScrollView>
        <TouchableOpacity style={styles.continueButton} onPress={() => onComplete(result)}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>{current + 1} / {QUESTIONS.length}</Text>
      <Text style={styles.question}>{QUESTIONS[current].q}</Text>

      <View style={styles.options}>
        {QUESTIONS[current].options.map((opt, i) => (
          <TouchableOpacity key={i} style={styles.option} onPress={() => handleAnswer(opt.style)}>
            <Text style={styles.optionText}>{opt.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={onSkip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 24, justifyContent: 'center' },
  progress: { fontSize: 14, color: '#999', textAlign: 'center', marginBottom: 16 },
  question: { fontSize: 22, fontWeight: '600', color: '#333', textAlign: 'center', marginBottom: 32, lineHeight: 30 },
  options: { gap: 12 },
  option: { backgroundColor: '#fff', borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#E8E8E0' },
  optionText: { fontSize: 15, color: '#444', lineHeight: 22 },
  skipButton: { alignItems: 'center', marginTop: 24 },
  skipText: { fontSize: 14, color: '#999' },
  resultContent: { alignItems: 'center', paddingVertical: 40 },
  resultEmoji: { fontSize: 64, marginBottom: 16 },
  resultTitle: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  resultDesc: { fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 24, paddingHorizontal: 16, marginBottom: 24 },
  disclaimer: { fontSize: 12, color: '#999', textAlign: 'center', fontStyle: 'italic', paddingHorizontal: 24 },
  continueButton: { height: 56, borderRadius: 16, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center' },
  continueText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});
