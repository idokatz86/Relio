---
name: configure-biometric-gate
description: Implements configurable biometric gate enforcement with FaceID/TouchID, user preference persistence in SecureStore, and hardware availability detection.
agents: [native-mobile-developer, chief-info-security-officer]
---
# Skill: Configure Biometric Gate

You implement configurable biometric lock enforcement for the Relio mobile app.

## Step 1: Biometric Settings in SecureStore
Add to `mobile/src/services/secure-storage.ts`:
- `setBiometricEnabled(enabled: boolean)` — persist user preference
- `isBiometricEnabled(): boolean` — read preference (default: true if hardware available)
- Key: `relio_biometric_enabled`

## Step 2: Hardware Detection
- `isBiometricAvailable()` — checks `LocalAuthentication.hasHardwareAsync()` + `isEnrolledAsync()`
- Default behavior: enabled if device has biometric hardware
- Graceful fallback: passcode if biometric unavailable

## Step 3: BiometricLockScreen Enforcement
- Auto-prompt biometric on mount
- Non-bypassable: user must authenticate to access app
- Retry button for failed attempts
- Settings toggle: respect `isBiometricEnabled` preference

## Step 4: Settings Integration
- Add "Biometric Lock" toggle in SettingsScreen
- Show only if `isBiometricAvailable() === true`
- Persist via `setBiometricEnabled()`

## Constraints
- Biometric gate prevents shoulder-surfing by abusive partners (DV safety measure)
- Never disable biometric gate programmatically — only by explicit user choice
- FaceID usage description required in iOS Info.plist
