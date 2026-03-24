/**
 * LoginScreen — Apple + Google + Email Sign In
 * 
 * Issue #107: Build LoginScreen.tsx
 * @see .github/agents/native-mobile-developer.agent.md — Biometric Gating
 * @see .github/skills/build-auth-screens/SKILL.md
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors, spacing, typography } from '../theme';

interface LoginScreenProps {
  onLoginSuccess: (token: string, userId: string) => void;
  onSignUp: () => void;
}

export function LoginScreen({ onLoginSuccess, onSignUp }: LoginScreenProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const API_URL = 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io';
      const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Login failed');
      }

      const data = await response.json();
      onLoginSuccess(data.token, data.userId);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    setLoading(true);
    setError('');
    try {
      const API_URL = 'https://relio-backend.livelytree-6981c681.swedencentral.azurecontainerapps.io';
      const response = await fetch(`${API_URL}/api/v1/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      if (!response.ok) {
        throw new Error(`${provider} login is not yet available. Please use email.`);
      }

      const data = await response.json();
      onLoginSuccess(data.token, data.userId);
    } catch (err: any) {
      setError(err.message || `${provider} login failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>{t('common.appName')}</Text>
        <Text style={styles.tagline}>{t('login.subtitle')}</Text>
      </View>

      <View style={styles.form}>
        {/* Apple Sign In */}
        <TouchableOpacity
          style={[styles.socialButton, styles.appleButton]}
          onPress={() => handleSocialLogin('apple')}
          disabled={loading}
          accessibilityLabel="Sign in with Apple"
          accessibilityRole="button"
        >
          <Text style={styles.appleButtonText}>{t('login.signInApple')}</Text>
        </TouchableOpacity>

        {/* Google Sign In */}
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => handleSocialLogin('google')}
          disabled={loading}
          accessibilityLabel="Sign in with Google"
          accessibilityRole="button"
        >
          <Text style={styles.googleButtonText}>{t('login.signInGoogle')}</Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Email */}
        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
          accessibilityLabel="Email address"
          accessibilityHint="Enter your email to sign in"
        />

        <TouchableOpacity
          style={[styles.emailButton, loading && styles.buttonDisabled]}
          onPress={handleEmailLogin}
          disabled={loading}
          accessibilityLabel="Sign in with email"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.emailButtonText}>{t('login.signInEmail')}</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('login.terms')} {t('login.termsLink')} {t('login.and')} {t('login.privacyLink')}.
        </Text>
        <Text style={styles.footerText}>
          {t('consent.aiDisclosure')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF5', justifyContent: 'center', padding: 24 },
  header: { alignItems: 'center', marginBottom: 40 },
  logo: { fontSize: 36, fontWeight: '700', color: '#6B705C', letterSpacing: 2 },
  tagline: { fontSize: 15, color: '#8B8B80', marginTop: 8, textAlign: 'center' },
  form: { gap: 12 },
  socialButton: { height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  appleButton: { backgroundColor: '#000' },
  appleButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  googleButton: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  googleButtonText: { color: '#333', fontSize: 16, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E0E0D8' },
  dividerText: { paddingHorizontal: 12, color: '#999', fontSize: 13 },
  input: { height: 50, borderWidth: 1, borderColor: '#E0E0D8', borderRadius: 12, paddingHorizontal: 16, fontSize: 16, backgroundColor: '#fff' },
  emailButton: { height: 50, borderRadius: 12, backgroundColor: '#6B705C', justifyContent: 'center', alignItems: 'center' },
  emailButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  error: { color: '#D94F4F', fontSize: 13, textAlign: 'center', marginTop: 8 },
  footer: { marginTop: 32, alignItems: 'center' },
  footerText: { fontSize: 11, color: '#999', textAlign: 'center', marginTop: 4 },
});
