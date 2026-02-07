import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, Lightbulb, Compass, BookOpen, Cpu } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const sectionIcons = {
  brain: Brain,
  target: Target,
  lightbulb: Lightbulb,
  compass: Compass,
  "book-open": BookOpen,
  cpu: Cpu,
};

export default function LandingPage() {
  const [sections, setSections] = useState([]);
  const [intro, setIntro] = useState(null);

  useEffect(() => {
    axios.get(`${API}/sections`).then((r) => setSections(r.data)).catch(console.error);
    axios.get(`${API}/introduction`).then((r) => setIntro(r.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen" data-testid="landing-page">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="hero-glow top-1/4 left-1/4" />
        <div className="hero-glow bottom-1/4 right-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase mb-8">
              Interactive Thinking System
            </p>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tight text-white leading-[1.1] max-w-4xl">
              Mastering Your Mind
              <br />
              <span className="text-white/50">with AI & Mental Models</span>
            </h1>
            <p className="mt-8 text-base md:text-lg text-white/50 max-w-2xl leading-relaxed font-sans">
              {intro?.paragraphs?.[0] || "A curated collection of 200+ mental models to help you think clearer, decide better, and create faster."}
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                to="/explore"
                data-testid="explore-btn"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black hover:scale-105 transition-transform duration-200 gap-2"
              >
                Begin Exploring
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/mindmap"
                data-testid="mindmap-btn"
                className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 gap-2"
              >
                View Mind Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dedication */}
      {intro && (
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <p className="font-serif text-xl md:text-2xl text-white/60 italic max-w-2xl mx-auto leading-relaxed">
                "{intro.dedication}"
              </p>
            </motion.blockquote>
          </div>
        </section>
      )}

      {/* Intro Beliefs */}
      {intro && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-3xl">
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-12 tracking-tight">
                Why This Exists
              </h2>
              <div className="space-y-6">
                {intro.paragraphs.slice(1).map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="text-white/50 leading-relaxed text-base"
                  >
                    {p}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Domains Grid */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-serif text-2xl md:text-3xl text-white mb-4 tracking-tight">
            Six Thinking Spaces
          </h2>
          <p className="text-white/40 text-base mb-16 max-w-lg">
            Each domain is a self-contained thinking space. Explore them in any order.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, i) => {
              const Icon = sectionIcons[section.icon] || Brain;
              return (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to={`/domain/${section.slug}`}
                    data-testid={`domain-card-${section.slug}`}
                    className="glass-card block rounded-2xl p-8 h-full group transition-colors duration-300 hover:-translate-y-1 transition-transform"
                  >
                    <div className="section-icon mb-6">
                      <Icon size={22} strokeWidth={1.5} className="text-white/70" />
                    </div>
                    <h3 className="font-serif text-lg text-white mb-3 tracking-tight">
                      {section.short_name}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/30 text-xs font-mono">
                        {section.model_count} models
                      </span>
                      <ArrowRight size={14} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Use */}
      {intro && (
        <section className="py-24 md:py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="max-w-2xl">
              <h2 className="font-serif text-2xl md:text-3xl text-white mb-12 tracking-tight">
                How to Use This
              </h2>
              <div className="space-y-6">
                {intro.how_to_use.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-white/20 font-mono text-xs mt-1 flex-shrink-0 w-6">
                      0{i + 1}
                    </span>
                    <p className="text-white/60 text-base leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <p className="font-serif text-white/80">AI-Powered Mind</p>
            <p className="text-white/30 text-xs mt-1 font-mono">ai.powered.mind  2026</p>
          </div>
          <div className="flex gap-6">
            <Link to="/explore" className="text-white/30 text-sm hover:text-white/60 transition-colors duration-200">Explore</Link>
            <Link to="/journal" className="text-white/30 text-sm hover:text-white/60 transition-colors duration-200">Journal</Link>
            <Link to="/conclusion" className="text-white/30 text-sm hover:text-white/60 transition-colors duration-200">Conclusion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
