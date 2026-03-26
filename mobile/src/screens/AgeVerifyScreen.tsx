/**
 * AgeVerifyScreen — Age verification gate (18+)
 * 
 * Issue #108: Build AgeVerifyScreen.tsx
 * @see .github/agents/chief-legal-officer.agent.md — Privilege Warning
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import { verifyAge } from '../services/api';

interface AgeVerifyScreenProps {
  onVerified: () => void;
  onUnderage: () => void;
}

export function AgeVerifyScreen({ onVerified, onUnderage }: AgeVerifyScreenProps) {
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const d = parseInt(day, 10);

    if (!y || !m || !d || y < 1900 || y > 2030 || m < 1 || m > 12 || d < 1 || d > 31) {
      setError('Please enter a valid date of birth');
      return;
    }

    const dob = new Date(y, m - 1, d);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('You must be 18 or older to use Relio');
      onUnderage();
      return;
    }

    try {
      const dateOfBirth = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      await verifyAge(dateOfBirth);
      onVerified();
    } catch (err) {
      console.error('[AgeVerify] Failed:', err);
      Alert.alert('Error', 'Age verification failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Age Verification</Text>
      <Text style={styles.subtitle}>
        Relio is designed for adults. Please confirm your date of birth.
      </Text>

      <View style={styles.dateRow}>
        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>Month</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateInputText}>
              {month ? String(month).padStart(2, '0') : 'MM'}
            </Text>
          </TouchableOpacity>
          {/* Simplified — in production, use a date picker */}
          <View style={styles.stepperRow}>
            <TouchableOpacity onPress={() => setMonth(String(Math.max(1, (parseInt(month || '0') - 1))))} style={styles.stepper}><Text>-</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setMonth(String(Math.min(12, (parseInt(month || '0') + 1))))} style={styles.stepper}><Text>+</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>Day</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateInputText}>
              {day ? String(day).padStart(2, '0') : 'DD'}
            </Text>
          </TouchableOpacity>
          <View style={styles.stepperRow}>
            <TouchableOpacity onPress={() => setDay(String(Math.max(1, (parseInt(day || '0') - 1))))} style={styles.stepper}><Text>-</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setDay(String(Math.min(31, (parseInt(day || '0') + 1))))} style={styles.stepper}><Text>+</Text></TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateField}>
          <Text style={styles.dateLabel}>Year</Text>
          <TouchableOpacity style={styles.dateInput}>
            <Text style={styles.dateInputText}>
              {year || 'YYYY'}
            </Text>
          </TouchableOpacity>
          <View style={styles.stepperRow}>
            <TouchableOpacity onPress={() => setYear(String(Math.max(1920, (parseInt(year || '2000') - 1))))} style={styles.stepper}><Text>-</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setYear(String(Math.min(2026, (parseInt(year || '2000') + 1))))} style={styles.stepper}><Text>+</Text></TouchableOpacity>
          </View>
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify Age</Text>
      </TouchableOpacity>

      <Text style={styles.disclaimer}>
        We only use your date of birth to verify you are 18+. 
        It is stored securely and never shared.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#8B8B80', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  dateRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  dateField: { alignItems: 'center' },
  dateLabel: { fontSize: 13, color: '#999', marginBottom: 4 },
  dateInput: { width: 72, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E0E0D8', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  dateInputText: { fontSize: 18, fontWeight: '600', color: '#333' },
  stepperRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  stepper: { width: 32, height: 28, borderRadius: 8, backgroundColor: '#E8E8E0', justifyContent: 'center', alignItems: 'center' },
  error: { color: '#D94F4F', fontSize: 14, textAlign: 'center', marginBottom: 16 },
  button: { height: 56, borderRadius: 16, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  disclaimer: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 16 },
});
