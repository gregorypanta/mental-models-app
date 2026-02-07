import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ConclusionPage() {
  const [conclusion, setConclusion] = useState(null);

  useEffect(() => {
    axios.get(`${API}/conclusion`).then((r) => setConclusion(r.data)).catch(console.error);
  }, []);

  if (!conclusion) return null;

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="conclusion-page">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/explore"
            data-testid="back-from-conclusion"
            className="inline-flex items-center gap-2 text-white/40 text-sm mb-12 hover:text-white/60 transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to Domains
          </Link>

          <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase mb-4">
            Conclusion
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-16 leading-tight">
            {conclusion.title}
          </h1>

          {/* Key Takeaways */}
          <div className="mb-20">
            <h2 className="font-serif text-xl md:text-2xl text-white mb-8 tracking-tight">
              Key Takeaways
            </h2>
            <div className="space-y-4">
              {conclusion.key_takeaways.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
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

          {/* How to Apply */}
          <div className="mb-20">
            <h2 className="font-serif text-xl md:text-2xl text-white mb-8 tracking-tight">
              How to Apply
            </h2>
            <div className="space-y-4">
              {conclusion.how_to_apply.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
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

          {/* 30-Day Challenge */}
          <div className="glass-card rounded-2xl p-8 md:p-10 mb-20">
            <h2 className="font-serif text-xl md:text-2xl text-white mb-6 tracking-tight">
              30-Day Challenge
            </h2>
            <p className="text-white/50 text-base leading-relaxed">
              {conclusion.challenge}
            </p>
          </div>

          {/* Final Thought */}
          <div className="mb-20 text-center py-12">
            <blockquote className="font-serif text-xl md:text-2xl text-white/60 italic max-w-2xl mx-auto leading-relaxed">
              "{conclusion.final_thought}"
            </blockquote>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/explore"
              data-testid="conclusion-explore-btn"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black hover:scale-105 transition-transform duration-200 gap-2"
            >
              Explore Models
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/journal"
              data-testid="conclusion-journal-btn"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-8 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 gap-2"
            >
              Start Journaling
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
