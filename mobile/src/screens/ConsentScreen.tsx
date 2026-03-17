/**
 * ConsentScreen — Terms of Service + Privacy Policy acceptance
 * 
 * Issue #109: Build ConsentScreen.tsx + consent API endpoints
 * @see .github/agents/chief-legal-officer.agent.md — Medical Disclaimer
 * @see .github/skills/implement-consent-audit/SKILL.md
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Linking } from 'react-native';

interface ConsentScreenProps {
  onAccept: () => void;
  tosVersion: string;
  privacyVersion: string;
}

export function ConsentScreen({ onAccept, tosVersion, privacyVersion }: ConsentScreenProps) {
  const [tosAccepted, setTosAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [aiDisclosure, setAiDisclosure] = useState(false);

  const allAccepted = tosAccepted && privacyAccepted && aiDisclosure;

  const handleAccept = async () => {
    if (!allAccepted) return;
    // TODO: Call /api/v1/consent/accept
    onAccept();
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Before we begin</Text>
        <Text style={styles.subtitle}>
          Please review and accept the following to use Relio
        </Text>

        {/* AI Disclosure */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>AI Disclosure</Text>
          <Text style={styles.cardText}>
            Relio uses artificial intelligence to mediate conversations between partners. 
            It is NOT therapy and is NOT a substitute for licensed professional help. 
            AI-generated responses may not always be accurate. If you or someone you know 
            is in immediate danger, please contact emergency services.
          </Text>
        </View>

        {/* Privacy Architecture */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Privacy is Architectural</Text>
          <Text style={styles.cardText}>
            Relio uses a 3-Tier Confidentiality Model:{'\n\n'}
            🔒 <Text style={styles.bold}>Private (Tier 1)</Text> — Your raw thoughts are NEVER shared with your partner. 
            Not even our admins can see them.{'\n\n'}
            🧠 <Text style={styles.bold}>Abstracted (Tier 2)</Text> — Pattern-level insights used internally by the AI.{'\n\n'}
            👥 <Text style={styles.bold}>Shared (Tier 3)</Text> — Only constructive, rephrased guidance is shown to your partner.
          </Text>
        </View>

        {/* Duty to Warn */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Safety & Duty to Warn</Text>
          <Text style={styles.cardText}>
            If our Safety Guardian detects imminent risk of harm to yourself or others, 
            Relio may break confidentiality to provide emergency resources. This is the 
            only exception to privacy — and it could save a life.
          </Text>
        </View>

        {/* Checkboxes */}
        <View style={styles.checkboxSection}>
          <View style={styles.checkboxRow}>
            <Switch value={tosAccepted} onValueChange={setTosAccepted} trackColor={{ true: '#6B705C' }} />
            <Text style={styles.checkboxText}>
              I accept the{' '}
              <Text style={styles.link} onPress={() => Linking.openURL('https://relio.app/terms')}>
                Terms of Service
              </Text>{' '}
              (v{tosVersion})
            </Text>
          </View>

          <View style={styles.checkboxRow}>
            <Switch value={privacyAccepted} onValueChange={setPrivacyAccepted} trackColor={{ true: '#6B705C' }} />
            <Text style={styles.checkboxText}>
              I accept the{' '}
              <Text style={styles.link} onPress={() => Linking.openURL('https://relio.app/privacy')}>
                Privacy Policy
              </Text>{' '}
              (v{privacyVersion})
            </Text>
          </View>

          <View style={styles.checkboxRow}>
            <Switch value={aiDisclosure} onValueChange={setAiDisclosure} trackColor={{ true: '#6B705C' }} />
            <Text style={styles.checkboxText}>
              I understand Relio uses AI and is NOT a licensed therapist
            </Text>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.acceptButton, !allAccepted && styles.buttonDisabled]}
        onPress={handleAccept}
        disabled={!allAccepted}
      >
        <Text style={styles.acceptButtonText}>I Agree — Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5' },
  scroll: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  title: { fontSize: 28, fontWeight: '700', color: '#333', textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#8B8B80', textAlign: 'center', marginTop: 8, marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#E8E8E0' },
  cardTitle: { fontSize: 17, fontWeight: '600', color: '#333', marginBottom: 8 },
  cardText: { fontSize: 14, color: '#666', lineHeight: 22 },
  bold: { fontWeight: '600', color: '#333' },
  checkboxSection: { marginTop: 16 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  checkboxText: { flex: 1, fontSize: 14, color: '#555' },
  link: { color: '#6B705C', textDecorationLine: 'underline', fontWeight: '600' },
  acceptButton: { position: 'absolute', bottom: 24, left: 24, right: 24, height: 56, borderRadius: 16, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center' },
  acceptButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  buttonDisabled: { opacity: 0.4 },
});
