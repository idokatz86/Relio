import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream-100 via-cream-50 to-sage-50 opacity-60" />

      {/* Floating decorative circles */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-sage-400/10 blur-3xl"
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-cream-200/40 blur-3xl"
        animate={{ y: [0, 15, 0], x: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h1
          className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal leading-tight tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Love isn't broken.
          <br />
          <span className="text-sage-500">It's just waiting</span>
          <br />
          to be rediscovered.
        </motion.h1>

        <motion.p
          className="mt-8 text-lg sm:text-xl text-charcoal-muted leading-relaxed max-w-2xl mx-auto font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          In a world of swipe-left and delete, Relio is the bridge to staying
          and repairing. Relationships are deep, and they are fixable with the
          right tools.
        </motion.p>

        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
        >
          <a
            href="#waitlist"
            className="inline-block px-8 py-4 bg-sage-400 text-white font-medium rounded-full
                       hover:bg-sage-500 transition-colors duration-300 text-lg
                       shadow-lg shadow-sage-400/20 hover:shadow-sage-500/30"
          >
            Join the Waitlist
          </a>
        </motion.div>
      </div>
    </section>
  )
}
