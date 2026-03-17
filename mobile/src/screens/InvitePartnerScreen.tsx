/**
 * InvitePartnerScreen — Generate invite code + QR + deep link
 * 
 * Issue #116: Build InvitePartnerScreen
 * @see .github/agents/ui-ux-expert.agent.md
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, ActivityIndicator } from 'react-native';
import { sendMessage, getAuthToken } from '../services/api';

const API_BASE = 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io';

interface InvitePartnerScreenProps {
  userId: string;
  onPartnerJoined: (roomId: string) => void;
  onBack: () => void;
}

export function InvitePartnerScreen({ userId, onPartnerJoined, onBack }: InvitePartnerScreenProps) {
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [deepLink, setDeepLink] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    createInvite();
  }, []);

  const createInvite = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const res = await fetch(`${API_BASE}/api/v1/invite/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      const data = await res.json();
      if (res.ok) {
        setInviteCode(data.code);
        setDeepLink(data.deepLink);
      } else {
        setError(data.error || 'Failed to create invite');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!inviteCode) return;
    await Share.share({
      message: `Join me on Relio — a private space for better communication.\n\nUse code: ${inviteCode}\n\nOr tap: ${deepLink}`,
      title: 'Relio Invite',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6B705C" />
        <Text style={styles.loadingText}>Creating your invite...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Invite Your Partner</Text>
      <Text style={styles.subtitle}>Share this code so they can join your private space</Text>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>Invite Code</Text>
            <Text style={styles.code}>{inviteCode}</Text>
            <Text style={styles.codeHint}>Expires in 7 days</Text>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share Invite</Text>
          </TouchableOpacity>

          <View style={styles.privacyNote}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyText}>
              Your partner will see their own private space first. Nothing you've written will be shared until you both choose to communicate.
            </Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', padding: 24, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 24 },
  backText: { fontSize: 16, color: '#6B705C' },
  title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#8B8B80', textAlign: 'center', marginTop: 8, marginBottom: 32 },
  codeBox: { alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, padding: 32, borderWidth: 2, borderColor: '#E8DED5', marginBottom: 24 },
  codeLabel: { fontSize: 13, color: '#999', textTransform: 'uppercase', letterSpacing: 1 },
  code: { fontSize: 42, fontWeight: '800', color: '#6B705C', letterSpacing: 8, marginVertical: 12 },
  codeHint: { fontSize: 12, color: '#BBB' },
  shareButton: { height: 56, borderRadius: 16, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  shareButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  privacyNote: { flexDirection: 'row', gap: 12, backgroundColor: '#F5EDE6', borderRadius: 12, padding: 16 },
  privacyIcon: { fontSize: 20 },
  privacyText: { flex: 1, fontSize: 13, color: '#8B7355', lineHeight: 18 },
  loadingText: { textAlign: 'center', marginTop: 16, color: '#999' },
  error: { color: '#D94F4F', textAlign: 'center', fontSize: 15 },
});
