import { motion } from "framer-motion"

export default function Privacy() {
  return (
    <div className="min-h-screen bg-cream-50 py-16 px-6">
      <motion.div
        className="max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <a href="/" className="text-sage-500 hover:text-sage-600 text-sm mb-8 inline-block">
          ← Back to Relio
        </a>

        <h1 className="font-serif text-4xl text-charcoal mb-2">Privacy Policy</h1>
        <p className="text-charcoal-muted text-sm mb-10">Last updated: March 24, 2026</p>

        <div className="prose prose-charcoal max-w-none space-y-8 text-charcoal-light leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-charcoal">1. Who We Are</h2>
            <p>
              Relio ("we", "our", "us") is an AI-powered communication tool for couples.
              We are <strong>not</strong> a medical provider, therapist, or mental health service.
              Relio is a technology product in the Lifestyle category.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">2. The 3-Tier Confidentiality Model</h2>
            <p>Your privacy is enforced by architecture, not just policy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Tier 1 (Private):</strong> Your raw thoughts, venting, and journal entries. Stored encrypted. <strong>Never shared with your partner.</strong> No admin can access this data.</li>
              <li><strong>Tier 2 (Abstracted):</strong> Pattern-level insights (e.g., attachment style). Internal to AI processing only.</li>
              <li><strong>Tier 3 (Actionable):</strong> Constructive, de-escalated guidance delivered to your partner. This is the only content your partner sees.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">3. Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account data:</strong> Email address, display name, preferred language</li>
              <li><strong>Relationship data:</strong> Relationship stage, attachment style assessment results</li>
              <li><strong>Content data:</strong> Private journal entries (Tier 1, encrypted), shared chat messages (Tier 3)</li>
              <li><strong>Technical data:</strong> Device type, OS version, app version, crash reports</li>
            </ul>
            <p className="mt-4">We do <strong>not</strong> collect: location data, contacts, photos, browsing history, or advertising identifiers.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">4. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide AI-mediated communication between partners</li>
              <li>To store your private journal entries (encrypted, accessible only to you)</li>
              <li>To assess attachment style and communication patterns</li>
              <li>To detect safety concerns (crisis, abuse indicators)</li>
              <li>To improve service quality through anonymized, aggregated analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">5. AI Processing</h2>
            <p>
              Relio uses AI language models to process your messages. Before any message reaches an AI model,
              personally identifiable information (PII) — including emails, phone numbers, and addresses — is
              redacted and replaced with tokens. The AI sees patterns, not identities.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">6. Data Storage & Security</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data stored on Microsoft Azure (Sweden Central, EU data residency)</li>
              <li>Tier 1 data: Row-Level Security (RLS) — only the author can access</li>
              <li>No foreign keys between private (Tier 1) and shared (Tier 3) databases</li>
              <li>At-rest encryption via device Secure Enclave (iOS) / Keystore (Android)</li>
              <li>In-transit encryption via TLS 1.3</li>
              <li>JWT authentication on all endpoints</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">7. Data Sharing</h2>
            <p>We do <strong>not</strong> sell your data. We do <strong>not</strong> share your data with advertisers. We share data only:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>With your partner: Only Tier 3 (constructive) content, never Tier 1</li>
              <li>With AI providers: PII-redacted message content for processing</li>
              <li>With law enforcement: Only when legally required (duty-to-warn for imminent harm)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">8. Your Rights (GDPR / CCPA)</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Export all your data in JSON format</li>
              <li><strong>Deletion:</strong> Delete your account and all associated data (24-hour grace period, then permanent cascade purge)</li>
              <li><strong>Portability:</strong> Download your data at any time</li>
              <li><strong>Rectification:</strong> Update your profile information</li>
              <li><strong>Withdraw consent:</strong> Revoke consent and stop using the service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">9. Data Retention</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Active account data: Retained while account is active</li>
              <li>Tier 1 private data: Auto-purged after 90 days</li>
              <li>Deleted accounts: All data removed within 24 hours + 30-day backup purge</li>
              <li>Safety audit logs: Retained 7 years (anonymized, per legal requirements)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">10. Children</h2>
            <p>
              Relio is intended for users aged 18 and older. We do not knowingly collect data from
              anyone under 18. The app includes an age verification gate.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">11. Contact</h2>
            <p>For privacy inquiries: <strong>privacy@myrelio.io</strong></p>
          </section>

        </div>
      </motion.div>
    </div>
  )
}
