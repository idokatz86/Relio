/**
 * LoginScreen — Apple + Google + Email Sign In
 * 
 * Issue #107: Build LoginScreen.tsx
 * @see .github/agents/native-mobile-developer.agent.md — Biometric Gating
 * @see .github/skills/build-auth-screens/SKILL.md
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { colors, spacing, typography } from '../theme';

interface LoginScreenProps {
  onLoginSuccess: (token: string, userId: string) => void;
  onSignUp: () => void;
}

export function LoginScreen({ onLoginSuccess, onSignUp }: LoginScreenProps) {
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
      // TODO: Integrate with Azure AD B2C email flow
      // For now, simulate a dev-mode login
      if (process.env.NODE_ENV === 'development' || __DEV__) {
        const devToken = 'dev-token';
        const devUserId = '550e8400-e29b-41d4-a716-446655440000';
        onLoginSuccess(devToken, devUserId);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'apple' | 'google') => {
    setLoading(true);
    setError('');
    try {
      // TODO: Integrate with Azure AD B2C social IdP (#98)
      // Apple: expo-apple-authentication
      // Google: expo-auth-session
      console.log(`[Auth] ${provider} login initiated`);
      if (__DEV__) {
        const devToken = 'dev-token';
        const devUserId = '550e8400-e29b-41d4-a716-446655440000';
        onLoginSuccess(devToken, devUserId);
      }
    } catch (err) {
      setError(`${provider} login failed. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Relio</Text>
        <Text style={styles.tagline}>A private space for better communication</Text>
      </View>

      <View style={styles.form}>
        {/* Apple Sign In */}
        <TouchableOpacity
          style={[styles.socialButton, styles.appleButton]}
          onPress={() => handleSocialLogin('apple')}
          disabled={loading}
        >
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        {/* Google Sign In */}
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => handleSocialLogin('google')}
          disabled={loading}
        >
          <Text style={styles.googleButtonText}>Continue with Google</Text>
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
        />

        <TouchableOpacity
          style={[styles.emailButton, loading && styles.buttonDisabled]}
          onPress={handleEmailLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.emailButtonText}>Continue with Email</Text>
          )}
        </TouchableOpacity>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </Text>
        <Text style={styles.footerText}>
          Relio is NOT therapy. It is AI-mediated communication support.
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
