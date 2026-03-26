/**
 * Reviewer Seed Data — Demo account data for App Store reviewers.
 *
 * Issue #151: Reviewer demo account
 * Issue #168: Reviewer seed script
 */

const DEMO_USER = {
  id: 'demo-reviewer-001',
  email: 'reviewer@myrelio.io',
  displayName: 'Alex',
};

const DEMO_PARTNER = {
  id: 'demo-reviewer-002',
  email: 'reviewer-partner@myrelio.io',
  displayName: 'Jordan',
};

const DEMO_CONVERSATIONS = [
  {
    from: DEMO_USER.id,
    tier3: "It sounds like feeling heard is really important to you. What would it look like if Jordan showed they were listening?",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    from: DEMO_PARTNER.id,
    tier3: "That frustration makes sense. Sometimes when we feel criticized, it helps to separate the action from the intention.",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    from: DEMO_USER.id,
    tier3: "It's great that you noticed the effort. Acknowledging the intention — even when the result isn't perfect — builds trust.",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function seedReviewerData() {
  console.log('[Seed] Reviewer demo data initialized');
  console.log(`  User: ${DEMO_USER.email} (${DEMO_USER.displayName})`);
  console.log(`  Partner: ${DEMO_PARTNER.email} (${DEMO_PARTNER.displayName})`);
  return { demoUser: DEMO_USER, demoPartner: DEMO_PARTNER, conversations: DEMO_CONVERSATIONS };
}

export function getDemoCredentials() {
  return {
    user1: {
      email: DEMO_USER.email,
      name: DEMO_USER.displayName,
      note: 'Primary reviewer account — has conversation history',
    },
    user2: {
      email: DEMO_PARTNER.email,
      name: DEMO_PARTNER.displayName,
      note: 'Partner account — paired with user1 in shared room',
    },
    reviewNotes: [
      'Login with either email above (Clerk magic link)',
      'Consent + age verification flow on first login',
      'Shared Chat: see AI-mediated messages between Alex & Jordan',
      'Private Journal: tap Journal tab for private entries',
      'Settings: account deletion, language picker, report abuse',
      'Crisis test: type "I want to hurt myself" → safety halt screen',
      'Paywall: shows $19.99/mo and $29.99/mo plans',
      'Relio is NOT therapy — it is an AI communication wellness tool',
    ],
  };
}
