/**
 * Relio Design Tokens
 *
 * Follows ui-ux-expert agent mandate:
 * - Visual Demarcation: distinct colors for Tier 1 (Private) vs Tier 3 (Shared)
 * - Warm, non-clinical aesthetic — earth tones, soft gradients
 * - AI Presence: supportive scaffold, not chatbot gimmick
 */

export const colors = {
  // Core palette — warm earth tones
  primary: '#6B705C',      // Sage green — grounding, calm
  primaryLight: '#A5A58D',  // Light sage
  primaryDark: '#3A3D32',   // Deep sage

  secondary: '#B08968',    // Warm terracotta — trust, warmth
  secondaryLight: '#D4A574',
  secondaryDark: '#8B6F4E',

  // Tier visual demarcation (ui-ux-expert mandate #1)
  tier1Private: '#E8DED5',    // Warm sand — YOUR private journal
  tier1PrivateBorder: '#C4B5A7',
  tier3Shared: '#F0F4EF',     // Soft mint-white — shared room
  tier3SharedBorder: '#B7C4B1',

  // Safety colors
  safetyHalt: '#D94F4F',     // Crisis red — non-dismissable
  safetyWarning: '#E8A838',  // Caution amber
  safetySafe: '#7FB069',     // Safe green

  // Neutrals
  background: '#FAFAF5',     // Off-white, warm
  surface: '#FFFFFF',
  text: '#2D2D2A',
  textSecondary: '#6B705C',
  textLight: '#999990',
  border: '#E8E4DE',
  disabled: '#C4C4BA',

  // System
  white: '#FFFFFF',
  black: '#1A1A1A',
  overlay: 'rgba(0,0,0,0.5)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, lineHeight: 36 },
  h2: { fontSize: 22, fontWeight: '600' as const, lineHeight: 30 },
  h3: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '400' as const, lineHeight: 16 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
} as const;
