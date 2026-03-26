/**
 * NPSSurveyScreen — Monthly NPS survey (0-10 scale + comment)
 * 
 * Triggered monthly via push notification or in-app prompt.
 * Submits to POST /api/v1/feedback with type: 'nps'
 */

import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native'

interface NPSSurveyScreenProps {
  onComplete: () => void
  onSkip: () => void
}

export function NPSSurveyScreen({ onComplete, onSkip }: NPSSurveyScreenProps) {
  const [score, setScore] = useState<number | null>(null)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (score === null) return
    setSubmitting(true)
    try {
      const { default: SecureStore } = await import('expo-secure-store')
      const token = await SecureStore.getItemAsync('relio_auth_token')

      const API_BASE = __DEV__
        ? 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io'
        : 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io'

      await fetch(`${API_BASE}/api/v1/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          type: 'nps',
          rating: score,
          comment: comment.trim() || undefined,
        }),
      })
      onComplete()
    } catch (err) {
      Alert.alert('Error', 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const getScoreColor = (n: number) => {
    if (score === n) return '#6B705C'
    if (n <= 6) return '#E8D5D5'
    if (n <= 8) return '#E8E5D5'
    return '#D5E8D5'
  }

  const getScoreLabel = () => {
    if (score === null) return ''
    if (score <= 6) return 'We hear you. What could we do better?'
    if (score <= 8) return 'Thanks! What would make it a 10?'
    return "That's amazing! What do you love most?"
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
        <Text style={styles.skipText}>Maybe later</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Quick question</Text>
      <Text style={styles.subtitle}>
        How likely are you to recommend Relio to a friend in a relationship?
      </Text>

      <View style={styles.scaleRow}>
        {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
          <TouchableOpacity
            key={n}
            style={[styles.scoreButton, { backgroundColor: getScoreColor(n) }]}
            onPress={() => setScore(n)}
          >
            <Text style={[styles.scoreText, score === n && styles.scoreTextSelected]}>{n}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.labelRow}>
        <Text style={styles.labelText}>Not likely</Text>
        <Text style={styles.labelText}>Extremely likely</Text>
      </View>

      {score !== null && (
        <>
          <Text style={styles.followUp}>{getScoreLabel()}</Text>
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us more (optional)..."
            placeholderTextColor="#AAA"
            value={comment}
            onChangeText={setComment}
            multiline
            maxLength={500}
          />
        </>
      )}

      <TouchableOpacity
        style={[styles.submitButton, (score === null || submitting) && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={score === null || submitting}
      >
        <Text style={styles.submitText}>{submitting ? 'Sending...' : 'Submit'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 24, justifyContent: 'center' },
  skipButton: { position: 'absolute', top: 60, right: 24 },
  skipText: { color: '#999', fontSize: 15 },
  title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 12, marginBottom: 32, lineHeight: 24 },
  scaleRow: { flexDirection: 'row', justifyContent: 'center', gap: 4 },
  scoreButton: { width: 30, height: 40, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  scoreText: { fontSize: 14, fontWeight: '600', color: '#666' },
  scoreTextSelected: { color: '#fff', fontWeight: '700' },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingHorizontal: 4 },
  labelText: { fontSize: 12, color: '#999' },
  followUp: { fontSize: 15, color: '#6B705C', textAlign: 'center', marginTop: 24, fontWeight: '500' },
  commentInput: {
    backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#E8E8E0',
    padding: 16, marginTop: 16, fontSize: 15, color: '#333', minHeight: 80, textAlignVertical: 'top',
  },
  submitButton: {
    height: 52, borderRadius: 14, backgroundColor: '#6B705C',
    justifyContent: 'center', alignItems: 'center', marginTop: 24,
  },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.4 },
})
