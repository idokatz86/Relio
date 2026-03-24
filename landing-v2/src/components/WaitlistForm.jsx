import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

async function handleSubmit(email, firstName) {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      first_name: firstName,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || "Something went wrong. Please try again.")
  }

  return response.json()
}

export default function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [status, setStatus] = useState("idle") // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("")

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")
    setErrorMsg("")

    try {
      await handleSubmit(email, firstName)
      setStatus("success")
      setEmail("")
      setFirstName("")
    } catch (err) {
      setStatus("error")
      setErrorMsg(err.message)
    }
  }

  return (
    <section id="waitlist" className="py-24 px-6 bg-gradient-to-b from-cream-50 to-sage-50">
      <div className="max-w-xl mx-auto text-center">
        <motion.h2
          className="font-serif text-3xl sm:text-4xl text-charcoal mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Be the first to know
        </motion.h2>

        <motion.p
          className="text-charcoal-muted mb-10 font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Join the waitlist and get early access when we launch.
          <br />
          No spam, ever. Just one email when we're ready.
        </motion.p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sage-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-5xl block mb-4">💚</span>
              <p className="text-lg font-medium text-charcoal">
                You're on the list!
              </p>
              <p className="text-charcoal-muted text-sm mt-2 font-light">
                We'll reach out when Relio is ready. Thank you for believing
                relationships are worth repairing.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={onSubmit}
              className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-sage-200
                         shadow-lg shadow-sage-400/5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name (optional)"
                  className="w-full px-5 py-3.5 rounded-xl bg-cream-50 border border-sage-200
                             text-charcoal placeholder:text-charcoal-muted/50
                             focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400
                             transition-all duration-200 text-base"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-5 py-3.5 rounded-xl bg-cream-50 border border-sage-200
                             text-charcoal placeholder:text-charcoal-muted/50
                             focus:outline-none focus:ring-2 focus:ring-sage-400/40 focus:border-sage-400
                             transition-all duration-200 text-base"
                />
                <button
                  type="submit"
                  disabled={status === "loading" || !email}
                  className="w-full px-6 py-3.5 bg-sage-400 text-white font-medium rounded-xl
                             hover:bg-sage-500 disabled:opacity-50 disabled:cursor-not-allowed
                             transition-all duration-300 text-base
                             shadow-md shadow-sage-400/20 hover:shadow-sage-500/30"
                >
                  {status === "loading" ? "Joining..." : "Join the Waitlist"}
                </button>
              </div>

              <AnimatePresence>
                {status === "error" && (
                  <motion.p
                    className="mt-4 text-red-500 text-sm"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {errorMsg}
                  </motion.p>
                )}
              </AnimatePresence>

              <p className="mt-4 text-xs text-charcoal-muted/60 font-light">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
