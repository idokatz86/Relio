/**
 * AcceptInviteScreen — Enter invite code to join partner's room
 * 
 * Issue #117: Build AcceptInviteScreen
 */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getAuthToken } from '../services/api';

const API_BASE = 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io';

interface AcceptInviteScreenProps {
  initialCode?: string;
  onPaired: (roomId: string, partnerName: string) => void;
  onBack: () => void;
}

export function AcceptInviteScreen({ initialCode, onPaired, onBack }: AcceptInviteScreenProps) {
  const [code, setCode] = useState(initialCode || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAccept = async () => {
    if (code.length !== 6) {
      setError('Please enter a 6-character invite code');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/api/v1/invite/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code: code.toUpperCase() }),
      });
      const data = await res.json();
      if (res.ok && data.paired) {
        onPaired(data.roomId, data.partnerName);
      } else {
        setError(data.error || 'Failed to accept invite');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Join Your Partner</Text>
      <Text style={styles.subtitle}>Enter the 6-character code your partner shared with you</Text>

      <TextInput
        style={styles.input}
        value={code}
        onChangeText={t => setCode(t.toUpperCase().replace(/[^A-F0-9]/g, '').slice(0, 6))}
        placeholder="ABC123"
        placeholderTextColor="#CCC"
        maxLength={6}
        autoCapitalize="characters"
        autoCorrect={false}
        textAlign="center"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, (code.length !== 6 || loading) && styles.buttonDisabled]}
        onPress={handleAccept}
        disabled={code.length !== 6 || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Join Room</Text>
        )}
      </TouchableOpacity>

      <View style={styles.privacyNote}>
        <Text style={styles.privacyIcon}>🔒</Text>
        <Text style={styles.privacyText}>
          Your private thoughts stay private. Only AI-transformed, constructive messages are shared between partners.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 24 },
  backText: { fontSize: 16, color: '#6B705C' },
  title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#8B8B80', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  input: { height: 72, borderWidth: 2, borderColor: '#E8DED5', borderRadius: 16, fontSize: 32, fontWeight: '700', letterSpacing: 8, color: '#6B705C', backgroundColor: '#fff', marginBottom: 16 },
  error: { color: '#D94F4F', fontSize: 14, textAlign: 'center', marginBottom: 12 },
  button: { height: 56, borderRadius: 16, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  buttonDisabled: { opacity: 0.4 },
  privacyNote: { flexDirection: 'row', gap: 12, backgroundColor: '#E8F0E8', borderRadius: 12, padding: 16 },
  privacyIcon: { fontSize: 20 },
  privacyText: { flex: 1, fontSize: 13, color: '#4A6741', lineHeight: 18 },
});
