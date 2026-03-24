import { motion } from "framer-motion"

export default function Footer() {
  return (
    <footer className="py-16 px-6 bg-sage-50/50 border-t border-sage-200/50">
      <div className="max-w-4xl mx-auto text-center">
        {/* Relationship Pulse heart */}
        <div className="mb-8 flex flex-col items-center">
          <motion.div
            className="text-4xl animate-pulse-heart cursor-default select-none"
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 300 }}
            title="Relationship Pulse"
          >
            💚
          </motion.div>
          <p className="mt-2 text-xs text-charcoal-muted/50 font-light tracking-widest uppercase">
            Relationship Pulse
          </p>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-sage-400">
            <circle cx="10" cy="16" r="6" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="22" cy="16" r="6" stroke="currentColor" strokeWidth="2.5" />
            <circle cx="16" cy="16" r="3" fill="currentColor" opacity="0.6" />
          </svg>
          <span className="font-serif text-xl text-charcoal">Relio</span>
        </div>

        <p className="text-sm text-charcoal-muted/60 font-light">
          Built with empathy. Powered by science.
        </p>
        <p className="mt-1 text-xs text-charcoal-muted/40 font-light">
          © {new Date().getFullYear()} Relio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
