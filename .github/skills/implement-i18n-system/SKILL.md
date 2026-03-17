---
name: implement-i18n-system
description: Implements internationalization (i18n) infrastructure for Relio mobile app using react-i18next with RTL support for Hebrew, locale detection, and string extraction.
agents: [native-mobile-developer, ui-ux-expert, mobile-qa]
---
# Skill: Implement i18n System (React Native)

You implement the complete internationalization infrastructure for the Relio mobile app.

## Step 1: Install and Configure react-i18next
- Install `react-i18next`, `i18next`, and `expo-localization`
- Create `mobile/src/i18n/index.ts` — init i18next with expo-localization auto-detect
- Configure: namespace support, interpolation, plurals, ICU format
- Wrap `App.tsx` with `I18nextProvider`
- Fallback language: `en`
- Supported languages: `en`, `es`, `pt-BR`, `he`

## Step 2: Create Locale Files
Structure:
```
mobile/src/i18n/
  index.ts          # i18next init + expo-localization
  locales/
    en.json         # English (source of truth, ~300 strings)
    es.json         # Spanish
    pt-BR.json      # Brazilian Portuguese
    he.json         # Hebrew (RTL)
```
- English is the source of truth — all other locale files mirror its keys
- Use nested namespaces: `onboarding.title`, `chat.placeholder`, `settings.language`
- Include: screen titles, button labels, error messages, consent text, psychoeducation cards

## Step 3: Extract Hardcoded Strings
- Replace all hardcoded English strings across 9+ screens with `t()` calls
- Screens: Onboarding, SharedChat, PrivateJournal, Crisis, BiometricLock, Settings, Login, AgeVerify, Consent, InvitePartner, AcceptInvite, PrivacyExplainer, PsychoeducationCards, AttachmentQuiz
- Components: ContextBanner, NavigationBar, ErrorBoundary
- Use `useTranslation()` hook in functional components

## Step 4: RTL Layout Support (Hebrew)
- Use `I18nManager.forceRTL(true)` when locale is `he` or `ar`
- Test all screens in RTL mode — text alignment, navigation direction, chat bubbles, card layouts
- Use `flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row'` where needed
- RTL also opens the door for future Arabic support

## Step 5: Language Picker in Onboarding
- Add language selection screen after app open / in Settings
- Auto-detect device locale via `expo-localization.getLocales()`
- Store selected language in `expo-secure-store` (persists across sessions)
- Send `preferredLanguage` to backend API on profile update
- Language change triggers full UI re-render (no app restart needed with react-i18next)

## Constraints
- NEVER ship untranslated strings — use English fallback for missing keys
- NEVER AI-translate clinical/safety content — require professional human translation
- NEVER hardcode emergency resources — use locale-aware resource map
- All date/time formatting must respect locale (use `Intl.DateTimeFormat` or `date-fns/locale`)
- Test with pseudo-locale (key names as values) to catch missing translations
