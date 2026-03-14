---
name: implement-local-encryption
description: Writes Swift or Kotlin code to secure local state management and biometric authentication.
---
Skill Instructions: Native Security Implementation
You secure the application on the physical device.

Step 1: Secure Storage
Write platform-specific code (using iOS Keychain/Secure Enclave or Android Keystore) to encrypt all locally cached chat logs and session tokens.

Step 2: Biometric Gate
Implement FaceID/TouchID (iOS) or BiometricPrompt (Android) to ensure that if a device is handed to a partner, they cannot open the app and read the user's private Tier 1 communications.

Step 3: Offline State
Build robust local caching mechanisms using SQLite or CoreData so users can draft private journal entries while offline, syncing securely when the connection is restored.
