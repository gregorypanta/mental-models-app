import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, Lightbulb, Compass, BookOpen, Cpu, Zap, CheckCircle2, Star } from "lucide-react";
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
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.15)_0%,_transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-16 md:py-24 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4"
              >
                Interactive E-Book
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl tracking-tighter leading-[0.9] mb-6 gradient-text font-bold"
              >
                AI-Powered<br />Mind
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-[#A1A1AA] leading-relaxed mb-8 max-w-lg"
              >
                {intro?.paragraphs?.[0] || "Rewiring the Way You Think in the Age of AI. Master 200+ mental models for smarter thinking, peak productivity, and strategic decision-making."}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4 mb-8"
              >
                <Link
                  to="/explore"
                  data-testid="explore-btn"
                  className="rounded-full px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] pulse-glow flex items-center"
                >
                  Start Exploring
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link
                  to="/mindmap"
                  data-testid="mindmap-btn"
                  className="rounded-full px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 transition-colors duration-200 flex items-center"
                >
                  Preview Mind Map
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-6 text-sm text-[#A1A1AA]"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>200+ Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>Interactive Content</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                  <span>AI Prompts</span>
                </div>
              </motion.div>
            </div>

            {/* 3D Book */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="w-64 md:w-80 h-96 md:h-[480px] bg-gradient-to-br from-[#1A1A1A] to-[#0F0F0F] rounded-lg shadow-2xl border border-white/10 overflow-hidden" style={{ boxShadow: '0 0 60px rgba(37,99,235,0.15)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-transparent" />
                  <div className="absolute inset-4 flex flex-col justify-between p-6">
                    <div>
                      <Brain className="w-12 h-12 text-[#2563EB] mb-4" />
                      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                        AI-Powered<br />Mind
                      </h3>
                    </div>
                    <div>
                      <p className="text-sm text-[#A1A1AA] mb-2">Interactive Mind Map</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#2563EB] text-[#2563EB]" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#2563EB]/20 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#2563EB]/10 rounded-full blur-2xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: BookOpen, title: "200+ Mental Models", desc: "Comprehensive collection of proven thinking frameworks" },
              { icon: Brain, title: "AI-Enhanced Learning", desc: "Learn how to leverage AI as your thinking partner" },
              { icon: Zap, title: "Practical Applications", desc: "Real-world examples and actionable exercises" },
              { icon: Target, title: "30-Day Challenge", desc: "Structured program to transform your thinking" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#0F0F0F] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-colors duration-300 card-hover"
              >
                <item.icon className="w-10 h-10 text-[#2563EB] mb-4" strokeWidth={1.5} />
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-[#A1A1AA] text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sections / Chapters */}
      <section className="py-24 md:py-32 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4">What's Inside</p>
            <h2 className="text-4xl md:text-6xl tracking-tight font-bold gradient-text">
              Six Thinking Spaces
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, i) => {
              const Icon = sectionIcons[section.icon] || Brain;
              return (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <Link
                    to={`/domain/${section.slug}`}
                    data-testid={`domain-card-${section.slug}`}
                    className="bg-[#0F0F0F] border border-white/5 p-8 rounded-2xl hover:border-blue-500/30 transition-colors duration-300 card-hover group block"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors duration-300">
                        <Icon className="w-7 h-7 text-[#2563EB]" strokeWidth={1.5} />
                      </div>
                      <span className="blue-badge">{section.model_count} Models</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{section.name}</h3>
                    <p className="text-[#A1A1AA] leading-relaxed text-sm">{section.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dedication / Quote */}
      {intro && (
        <section className="py-24 md:py-32 bg-[#0F0F0F]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <blockquote className="text-2xl md:text-3xl font-bold text-white/70 italic max-w-3xl mx-auto leading-relaxed">
                "{intro.dedication}"
              </blockquote>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl tracking-tighter font-bold gradient-text mb-6">
              Start Thinking Smarter Today
            </h2>
            <p className="text-[#A1A1AA] text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Explore 200+ mental models and transform your thinking with AI-powered insights.
            </p>
            <Link
              to="/explore"
              data-testid="cta-explore-btn"
              className="rounded-full px-10 py-5 text-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_30px_rgba(37,99,235,0.4)] inline-flex items-center"
            >
              Explore All Models
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-[#2563EB]" />
            <span className="font-bold text-white">AI-Powered Mind</span>
            <span className="text-white/20 text-xs font-mono ml-2">2026</span>
          </div>
          <div className="flex gap-6">
            <Link to="/explore" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Explore</Link>
            <Link to="/mindmap" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Mind Map</Link>
            <Link to="/journal" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Journal</Link>
            <Link to="/conclusion" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Conclusion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
