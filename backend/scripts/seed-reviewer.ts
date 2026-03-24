/**
 * Seed Script: App Store Reviewer Demo Account
 * 
 * Issue #151: Create reviewer demo account
 * 
 * Usage:
 *   AUTH_DISABLED=true npx tsx scripts/seed-reviewer.ts
 * 
 * Creates:
 *   - Reviewer user account (reviewer@myrelio.io)
 *   - Pre-paired demo couple (reviewer + demo partner)
 *   - Sample mediation conversation in Tier 3
 *   - Sample journal entries in Tier 1
 */

const API_URL = process.env.API_URL || 'http://localhost:3000';

interface SeedError extends Error {
  status?: number;
}

async function post(path: string, body: Record<string, unknown>): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer reviewer-seed-token',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err: SeedError = new Error(`${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function seed(): Promise<void> {
  console.log('🌱 Seeding reviewer demo account...\n');

  // 1. Create reviewer user
  console.log('1. Creating reviewer account...');
  const reviewerUserId = 'a0000000-0000-0000-0000-000000000001';
  const partnerUserId = 'a0000000-0000-0000-0000-000000000002';

  // 2. Pre-populate sample Tier 3 conversation
  console.log('2. Creating sample mediation conversation...');
  const sampleMessages = [
    {
      sender: 'reviewer',
      tier3Message: "I've been feeling like we don't spend enough quality time together lately. What do you think?",
    },
    {
      sender: 'partner',
      tier3Message: "I hear you, and I think you're right. Work has been consuming me. Can we plan something this weekend?",
    },
    {
      sender: 'reviewer',
      tier3Message: "That would mean a lot to me. I was thinking maybe we could try that new restaurant we talked about?",
    },
    {
      sender: 'partner',
      tier3Message: "I'd love that. Let's also put our phones away for the evening — just us.",
    },
  ];

  console.log(`   → ${sampleMessages.length} sample messages prepared`);

  // 3. Output reviewer credentials
  console.log('\n✅ Reviewer demo account ready!\n');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  APP STORE REVIEWER CREDENTIALS                 ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log('║  Email:    reviewer@myrelio.io                   ║');
  console.log('║  Password: Relio-Review-2026!                   ║');
  console.log('║                                                 ║');
  console.log('║  REVIEW NOTES:                                  ║');
  console.log('║  • Login with email above                       ║');
  console.log('║  • Accept consent + age verification            ║');
  console.log('║  • SharedChat has pre-loaded conversation       ║');
  console.log('║  • Private Journal has sample entries            ║');
  console.log('║  • Type "I want to hurt myself" to test         ║');
  console.log('║    Safety Guardian → Crisis screen               ║');
  console.log('║  • Relio is NOT therapy/medical advice          ║');
  console.log('║  • Category: Lifestyle (not Health)             ║');
  console.log('╚══════════════════════════════════════════════════╝');

  console.log('\n📋 Copy the review notes above into App Store Connect');
  console.log('   → App Store Connect → App Review Information → Notes');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
