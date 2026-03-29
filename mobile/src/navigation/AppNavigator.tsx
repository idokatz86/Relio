/**
 * Navigation Configuration
 *
 * Three navigator groups:
 * 1. AuthStack — biometric, login (unauthenticated)
 * 2. OnboardingStack — consent → age → privacy → setup → quiz → paywall
 * 3. MainTabs — chat, journal, settings (+ modal screens)
 *
 * Issue #153: Complete navigation flow — wire all 15+ screens
 */

import React from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, Platform } from 'react-native';
import { useAuthContext } from '../auth/AuthContext';
import { colors } from '../theme';

// Screens
import { BiometricLockScreen } from '../screens/BiometricLockScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { ConsentScreen } from '../screens/ConsentScreen';
import { AgeVerifyScreen } from '../screens/AgeVerifyScreen';
import { PrivacyExplainerScreen } from '../screens/PrivacyExplainerScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { PsychoeducationCards } from '../screens/PsychoeducationCards';
import { AttachmentQuizScreen } from '../screens/AttachmentQuizScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { SharedChatScreen } from '../screens/SharedChatScreen';
import { PrivateJournalScreen } from '../screens/PrivateJournalScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { CrisisScreen } from '../screens/CrisisScreen';
import { LanguagePickerScreen } from '../screens/LanguagePickerScreen';
import { InvitePartnerScreen } from '../screens/InvitePartnerScreen';
import { AcceptInviteScreen } from '../screens/AcceptInviteScreen';
import { NPSSurveyScreen } from '../screens/NPSSurveyScreen';
import { SoloTranslateScreen } from '../screens/SoloTranslateScreen';
import { InsightsScreen } from '../screens/InsightsScreen';

// ── Type Definitions ─────────────────────────────────────
export type AuthStackParamList = {
  Biometric: undefined;
  Login: undefined;
};

export type OnboardingStackParamList = {
  Consent: undefined;
  AgeVerify: undefined;
  PrivacyExplainer: undefined;
  Onboarding: undefined;
  Psychoeducation: undefined;
  AttachmentQuiz: undefined;
  Paywall: undefined;
};

export type MainTabParamList = {
  Translate: undefined;
  Journal: undefined;
  Insights: undefined;
  Chat: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: undefined;
  OnboardingFlow: undefined;
  Main: undefined;
  Crisis: { severity: string };
  LanguagePicker: undefined;
  InvitePartner: undefined;
  AcceptInvite: { code?: string };
  NPSSurvey: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStackNav = createNativeStackNavigator<AuthStackParamList>();
const OnboardingStackNav = createNativeStackNavigator<OnboardingStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// ── Deep Linking ─────────────────────────────────────────
const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['relio://', 'https://myrelio.io'],
  config: {
    screens: {
      AcceptInvite: {
        path: 'invite/:code',
        parse: { code: (code: string) => code },
      },
      Main: 'home',
    },
  },
};

// ── Auth Stack ───────────────────────────────────────────
function AuthStack() {
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Biometric" component={BiometricLockScreen as any} />
      <AuthStackNav.Screen name="Login" component={LoginScreen as any} />
    </AuthStackNav.Navigator>
  );
}

// ── Onboarding Stack ─────────────────────────────────────
function OnboardingStack() {
  return (
    <OnboardingStackNav.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent swiping back during onboarding
      }}
    >
      <OnboardingStackNav.Screen name="PrivacyExplainer" component={PrivacyExplainerScreen as any} />
      <OnboardingStackNav.Screen name="Consent" component={ConsentScreen as any} />
      <OnboardingStackNav.Screen name="AgeVerify" component={AgeVerifyScreen as any} />
      <OnboardingStackNav.Screen name="Onboarding" component={OnboardingScreen as any} />
      <OnboardingStackNav.Screen name="AttachmentQuiz" component={AttachmentQuizScreen as any} />
    </OnboardingStackNav.Navigator>
  );
}

// ── Main Tabs ────────────────────────────────────────────
function MainTabs() {
  return (
    <MainTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          height: Platform.OS === 'ios' ? 85 : 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <MainTab.Screen
        name="Translate"
        component={SoloTranslateScreen as any}
        options={{
          tabBarLabel: 'Translate',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>✨</Text>,
          tabBarAccessibilityLabel: 'Solo translation - say it here first',
        }}
      />
      <MainTab.Screen
        name="Journal"
        component={PrivateJournalScreen as any}
        options={{
          tabBarLabel: 'Journal',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📓</Text>,
          tabBarAccessibilityLabel: 'Private journal',
        }}
      />
      <MainTab.Screen
        name="Chat"
        component={SharedChatScreen as any}
        options={{
          tabBarLabel: 'Chat',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>💬</Text>,
          tabBarAccessibilityLabel: 'Shared chat room with partner',
        }}
      />
      <MainTab.Screen
        name="Insights"
        component={InsightsScreen as any}
        options={{
          tabBarLabel: 'Insights',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>📊</Text>,
          tabBarAccessibilityLabel: 'Communication pattern insights',
        }}
      />
      <MainTab.Screen
        name="Settings"
        component={SettingsScreen as any}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>⚙️</Text>,
          tabBarAccessibilityLabel: 'Settings',
        }}
      />
    </MainTab.Navigator>
  );
}

// ── Root Navigator ───────────────────────────────────────
export function AppNavigator() {
  const { isSignedIn, isLoading } = useAuthContext();

  if (isLoading) {
    return null; // Splash screen handles the loading state
  }

  return (
    <NavigationContainer linking={linking}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isSignedIn ? (
          <RootStack.Screen name="Auth" component={AuthStack} />
        ) : (
          <>
            <RootStack.Screen name="OnboardingFlow" component={OnboardingStack} />
            <RootStack.Screen name="Main" component={MainTabs} />
            <RootStack.Screen
              name="Crisis"
              component={CrisisScreen as any}
              options={{ presentation: 'fullScreenModal', gestureEnabled: false }}
            />
            <RootStack.Screen
              name="LanguagePicker"
              component={LanguagePickerScreen as any}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="InvitePartner"
              component={InvitePartnerScreen as any}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="AcceptInvite"
              component={AcceptInviteScreen as any}
              options={{ presentation: 'modal' }}
            />
            <RootStack.Screen
              name="NPSSurvey"
              component={NPSSurveyScreen as any}
              options={{ presentation: 'modal' }}
            />
          </>
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
