import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Target, Lightbulb, Compass, BookOpen, Cpu, ArrowRight } from "lucide-react";
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

export default function ExplorePage() {
  const [sections, setSections] = useState([]);

  useEffect(() => {
    axios.get(`${API}/sections`).then((r) => setSections(r.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="explore-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase mb-4">Domains</p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6">
            Thinking Spaces
          </h1>
          <p className="text-white/40 text-base max-w-xl mb-16 leading-relaxed">
            Choose a domain to begin. Each space contains a curated set of mental models designed for a specific dimension of thinking.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => {
            const Icon = sectionIcons[section.icon] || Brain;
            return (
              <motion.div
                key={section.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to={`/domain/${section.slug}`}
                  data-testid={`explore-card-${section.slug}`}
                  className="glass-card block rounded-2xl p-8 md:p-10 group transition-colors duration-300"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="section-icon">
                      <Icon size={22} strokeWidth={1.5} className="text-white/70" />
                    </div>
                    <span className="text-white/20 font-mono text-xs">
                      {String(section.index).padStart(2, '0')}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl md:text-2xl text-white mb-3 tracking-tight">
                    {section.short_name}
                  </h2>
                  <p className="text-white/40 text-sm leading-relaxed mb-8">
                    {section.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/30 text-xs font-mono">{section.model_count} models</span>
                    <ArrowRight size={16} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
