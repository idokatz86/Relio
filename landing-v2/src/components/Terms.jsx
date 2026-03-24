import { motion } from "framer-motion"

export default function Terms() {
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

        <h1 className="font-serif text-4xl text-charcoal mb-2">Terms of Service</h1>
        <p className="text-charcoal-muted text-sm mb-10">Last updated: March 24, 2026</p>

        <div className="prose prose-charcoal max-w-none space-y-8 text-charcoal-light leading-relaxed">

          <section>
            <h2 className="font-serif text-2xl text-charcoal">1. Acceptance</h2>
            <p>
              By using Relio, you agree to these Terms of Service. If you do not agree, do not use the app.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">2. Not Therapy — Medical Disclaimer</h2>
            <p className="bg-cream-100 p-4 rounded-xl border border-sage-200">
              <strong>Relio is NOT therapy, counseling, or medical advice.</strong> Relio is a technology-based
              communication tool. It does not diagnose, treat, cure, or prevent any medical or psychological
              condition. The AI mediator provides communication assistance only — it is not a licensed
              therapist, psychologist, or medical professional. If you are in crisis, contact emergency
              services or a licensed professional immediately.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">3. Eligibility</h2>
            <p>You must be at least 18 years old to use Relio. By creating an account, you confirm you meet this requirement.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">4. AI Disclosure</h2>
            <p>
              Relio uses artificial intelligence to process your messages and generate mediator responses.
              AI-generated content may not always be accurate, appropriate, or complete. You should not
              rely on AI output as a substitute for professional relationship counseling or therapy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">5. Privacy Architecture</h2>
            <p>
              Relio operates a 3-Tier Confidentiality Model. Your private thoughts (Tier 1) are never
              shared with your partner. Only constructive, de-escalated guidance (Tier 3) reaches them.
              See our <a href="/privacy" className="text-sage-500 underline">Privacy Policy</a> for full details.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">6. Safety & Duty to Warn</h2>
            <p>
              Relio includes a Safety Guardian that monitors for indicators of domestic violence,
              self-harm, or child abuse. In cases of <strong>imminent danger</strong>, Relio may:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Halt the conversation and display emergency resources</li>
              <li>Provide locale-aware crisis hotline numbers</li>
              <li>In extreme cases, comply with legal duty-to-warn obligations</li>
            </ul>
            <p className="mt-2">This is the only exception to our privacy guarantees.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">7. User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use Relio to threaten, harass, or abuse another person</li>
              <li>Attempt to extract another user's Tier 1 private data</li>
              <li>Manipulate the AI mediator through prompt injection</li>
              <li>Use the service if you are under 18</li>
              <li>Misrepresent Relio as therapy or medical treatment to others</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">8. Account Deletion</h2>
            <p>
              You may delete your account at any time from Settings. Deletion includes a 24-hour
              grace period (in case of accidental deletion), after which all your data — including
              private journal entries, shared conversations, and profile data — is permanently
              and irreversibly purged.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">9. Limitation of Liability</h2>
            <p>
              Relio is provided "as is" without warranties. We are not liable for any relationship
              outcomes, emotional distress, or decisions made based on AI-generated mediator content.
              Our maximum liability is limited to fees paid in the 12 months prior to the claim.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">10. Subscription & Billing</h2>
            <p>
              Free tier available. Premium subscriptions billed monthly via Apple App Store or Google Play.
              Cancel anytime — access continues until end of billing period. No refunds for partial months.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">11. Changes to Terms</h2>
            <p>
              We may update these terms. Material changes will be communicated via in-app notification
              and require re-consent before continued use.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">12. Governing Law</h2>
            <p>These terms are governed by the laws of the State of Israel.</p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-charcoal">13. Contact</h2>
            <p>For legal inquiries: <strong>legal@myrelio.io</strong></p>
          </section>

        </div>
      </motion.div>
    </div>
  )
}
