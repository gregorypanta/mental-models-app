import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Target, Lightbulb, Compass, BookOpen, Cpu, CheckCircle2, Sparkles, Trophy, Copy, Check } from "lucide-react";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";


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
  const [dailyModel, setDailyModel] = useState(null);
  const [stats, setStats] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    axios.get(`${API}/sections`).then((r) => setSections(r.data)).catch(console.error);
    axios.get(`${API}/introduction`).then((r) => setIntro(r.data)).catch(console.error);
    axios.get(`${API}/daily-model`).then((r) => setDailyModel(r.data)).catch(console.error);
    axios.get(`${API}/stats`).then((r) => setStats(r.data)).catch(console.error);
  }, []);

  const copyPrompt = () => {
    if (!dailyModel) return;
    navigator.clipboard.writeText(dailyModel.ai_prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen" data-testid="landing-page">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.15)_0%,_transparent_50%)]" />
        <div className="hero-glow top-1/4 left-1/4" />
        <div className="hero-glow bottom-1/4 right-1/4" />
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 pt-32 pb-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <p className="text-[#2563EB] font-mono text-xs tracking-[0.3em] uppercase mb-8">
              Interactive Thinking System
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl tracking-tighter font-bold leading-[1.1] max-w-4xl gradient-text">
              Mastering Your Mind
              <br />
              <span className="text-white/50">with AI & Mental Models</span>
            </h1>
            <p className="mt-8 text-base md:text-lg text-[#A1A1AA] max-w-2xl leading-relaxed">
              {intro?.paragraphs?.[0] || "A curated collection of 200+ mental models to help you think clearer, decide better, and create faster."}
            </p>
            <div className="mt-8 flex items-center gap-6 text-sm text-[#A1A1AA]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>200+ Models</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>Interactive</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                <span>AI Prompts</span>
              </div>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/explore"
                data-testid="explore-btn"
                className="rounded-full px-8 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-flex items-center gap-2"
              >
                Begin Exploring
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/mindmap"
                data-testid="mindmap-btn"
                className="rounded-full px-8 py-3.5 border border-white/20 bg-transparent text-white text-sm font-medium hover:bg-white/5 transition-colors duration-200 inline-flex items-center gap-2"
              >
                View Mind Map
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dedication */}
      {intro && (
        <section className="py-24 md:py-32 bg-[#0F0F0F]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <motion.blockquote
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="text-center"
            >
              <p className="text-xl md:text-2xl font-bold text-white/60 italic max-w-2xl mx-auto leading-relaxed">
                "{intro.dedication}"
              </p>
            </motion.blockquote>
          </div>
        </section>
      )}

      {/* Intro Beliefs */}
      {intro && (
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 tracking-tight">
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
                    className="text-[#A1A1AA] leading-relaxed text-base"
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
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4">What's Inside</p>
          <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4 tracking-tight">
            Six Thinking Spaces
          </h2>
          <p className="text-[#A1A1AA] text-base mb-16 max-w-lg">
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
                    className="bg-[#0F0F0F] border border-white/5 block rounded-2xl p-8 h-full group hover:border-blue-500/30 transition-colors duration-300 card-hover"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors duration-300">
                        <Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.5} />
                      </div>
                      <span className="blue-badge">{section.model_count} Models</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">
                      {section.short_name}
                    </h3>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">
                      {section.description}
                    </p>
                    <ArrowRight size={14} className="text-white/30 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-transform duration-200" />
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
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-12 tracking-tight">
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
                    <span className="text-[#2563EB] font-mono text-xs mt-1 flex-shrink-0 w-6">
                      0{i + 1}
                    </span>
                    <p className="text-[#A1A1AA] text-base leading-relaxed">{item}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Daily Model */}
      {dailyModel && (
        <section className="py-24 md:py-32 bg-[#0F0F0F]">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Sparkles size={16} className="text-[#2563EB]" />
                <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono">Model of the Day</p>
              </div>
              <div className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-8 md:p-10 hover:border-[#2563EB]/30 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-3">
                  <span className="blue-badge">{dailyModel.section_name}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{dailyModel.title}</h3>
                <p className="text-[#A1A1AA] leading-relaxed mb-6 max-w-2xl">{dailyModel.explanation}</p>
                <div className="bg-[#2563EB]/5 border border-[#2563EB]/15 rounded-xl p-4 mb-6">
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-mono text-sm text-[#A1A1AA]">{dailyModel.ai_prompt}</p>
                    <button onClick={copyPrompt} className="flex-shrink-0 p-2 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 hover:bg-[#2563EB]/20 transition-colors duration-200">
                      {copied ? <Check size={14} className="text-[#10B981]" /> : <Copy size={14} className="text-[#2563EB]" />}
                    </button>
                  </div>
                </div>
                <Link
                  to={`/model/${dailyModel.section_slug}/${dailyModel.model_index}`}
                  data-testid="daily-model-link"
                  className="rounded-full px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold hover:scale-105 transition-transform duration-200 inline-flex items-center gap-2"
                >
                  Explore This Model <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 30-Day Challenge CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(37,99,235,0.08)_0%,_transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 md:px-12 lg:px-24 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Trophy size={32} className="text-[#2563EB] mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl tracking-tighter font-bold gradient-text mb-4">
              30-Day Thinking Challenge
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 max-w-xl mx-auto">
              Pick 5 mental models. Practice them daily. Track your streak. Transform how you think in just 30 days.
            </p>
            {stats?.challenge_active ? (
              <Link
                to="/challenge"
                data-testid="challenge-cta"
                className="rounded-full px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-flex items-center gap-2"
              >
                Continue Challenge ({stats.challenge_progress}/30 days)
                <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                to="/challenge"
                data-testid="challenge-cta"
                className="rounded-full px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] inline-flex items-center gap-2"
              >
                Start the Challenge
                <ArrowRight size={16} />
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-[#2563EB]" />
            <span className="font-bold text-white">AI-Powered Mind</span>
            <span className="text-white/20 text-xs font-mono ml-2">2026</span>
          </div>
          <div className="flex gap-6">
            <Link to="/explore" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Explore</Link>
            <Link to="/journal" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Journal</Link>
            <Link to="/conclusion" className="text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200">Conclusion</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
