/**
 * Relio Investor Demo — Interactive CLI
 * 
 * Demonstrates the 5-agent pipeline in real-time.
 * Type a message as "Partner A" → see the Tier 3 transformation for "Partner B".
 * 
 * Run: npx tsx src/demo/investor-demo.ts
 * 
 * @see Issue #27
 */

import 'dotenv/config';
import * as readline from 'node:readline';
import { processMessage } from '../pipeline/mediation-pipeline.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function main() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    RELIO — INVESTOR DEMO                      ║
║                                                               ║
║  The world's first AI-powered 3-way relationship mediator.    ║
║  Privacy is architecture, not policy.                         ║
║                                                               ║
║  Type as Partner A. See what Partner B receives.              ║
║  Type "quit" to exit.                                         ║
╚═══════════════════════════════════════════════════════════════╝

Provider: ${process.env.LLM_PROVIDER || 'github'} (GitHub Models API)
Pipeline: Safety Guardian → Orchestrator → Profiler → Communication Coach
`);

  let messageCount = 0;

  while (true) {
    const input = await prompt('\n💬 Partner A says: ');
    
    if (input.toLowerCase() === 'quit' || input.toLowerCase() === 'exit') {
      console.log('\n👋 Demo ended. Thank you for watching.\n');
      break;
    }

    if (!input.trim()) continue;

    messageCount++;
    console.log('\n⏳ Processing through 5-agent pipeline...\n');

    try {
      const startTime = Date.now();
      const result = await processMessage('demo-user-a', input);
      const elapsed = Date.now() - startTime;

      // === Display Pipeline Results ===
      console.log('┌─── PIPELINE RESULTS ────────────────────────────┐');
      
      // Safety
      const safetyIcon = result.safetyCheck.halt ? '🛑' : '✅';
      console.log(`│ Safety:     ${safetyIcon} ${result.safetyCheck.severity}`);
      
      if (result.safetyCheck.halt) {
        console.log(`│ ⛔ SAFETY HALT — Pipeline stopped.`);
        console.log(`│ Reason:     ${result.safetyCheck.reasoning}`);
        console.log(`│ Action:     Emergency resources would be delivered.`);
        console.log('└─────────────────────────────────────────────────┘');
        continue;
      }

      // Profile
      if (result.profile) {
        const attachment = result.profile.attachmentStyle;
        const confidence = Math.round(result.profile.attachmentConfidence * 100);
        console.log(`│ Profile:    ${attachment} attachment (${confidence}% confidence)`);
        console.log(`│ State:      ${result.profile.activationState}`);
      }

      // Agents invoked
      console.log(`│ Agents:     ${result.agentsInvoked.join(' → ')}`);
      console.log(`│ Time:       ${elapsed}ms`);
      
      console.log('├─────────────────────────────────────────────────┤');
      console.log('│                                                 │');
      console.log('│  🔒 TIER 1 (Private — Partner B NEVER sees):   │');
      console.log(`│  "${input.substring(0, 50)}${input.length > 50 ? '...' : ''}"`);
      console.log('│                                                 │');
      console.log('│  💬 TIER 3 (What Partner B actually receives):  │');
      
      // Word-wrap the Tier 3 output
      const words = (result.tier3Output || '').split(' ');
      let line = '│  "';
      for (const word of words) {
        if (line.length + word.length > 52) {
          console.log(line);
          line = '│   ' + word + ' ';
        } else {
          line += word + ' ';
        }
      }
      console.log(line.trimEnd() + '"');
      
      console.log('│                                                 │');
      console.log('└─────────────────────────────────────────────────┘');

    } catch (error) {
      console.error(`\n❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log('Make sure your GITHUB_TOKEN is set in .env');
    }
  }

  console.log(`\nTotal messages processed: ${messageCount}`);
  rl.close();
}

main();
