import { motion } from "framer-motion"

const pillars = [
  {
    icon: "🧠",
    title: "Guided Emotional Intelligence",
    desc: "AI-powered mediation rooted in Gottman Method and Emotionally Focused Therapy — not generic advice.",
  },
  {
    icon: "🔒",
    title: "Radical Privacy",
    desc: "Your private thoughts stay private. Our 3-Tier architecture makes it physically impossible for your partner to see what you vent.",
  },
  {
    icon: "💬",
    title: "Real-Time Mediation",
    desc: "Express what you feel. We translate it into words your partner can actually hear — without the explosions.",
  },
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-cream-50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">
            Why Relio?
          </h2>
          <p className="mt-2 font-serif text-xl sm:text-2xl text-sage-500 italic">
            Because some things are meant to be fixed.
          </p>
        </motion.div>

        <motion.p
          className="text-center text-lg text-charcoal-muted leading-relaxed max-w-2xl mx-auto mb-16 font-light"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Relio provides a sanctuary for partnerships to speak the same language
          again. Through guided emotional intelligence, we help you and your
          partner move from blame to understanding — privately, safely, and at
          your own pace.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-sage-100
                         hover:border-sage-300 transition-colors duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <span className="text-4xl block mb-4">{pillar.icon}</span>
              <h3 className="font-semibold text-lg text-charcoal mb-3">
                {pillar.title}
              </h3>
              <p className="text-charcoal-muted text-sm leading-relaxed font-light">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
