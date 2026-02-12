import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";

// Χρησιμοποιούμε process.env και το πρόθεμα REACT_APP_ για Create React App
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
const API = rawAPI.endsWith('/') ? rawAPI.slice(0, -1) : rawAPI;


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
            className="inline-flex items-center gap-2 text-[#A1A1AA] text-sm mb-12 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            Back to Domains
          </Link>

          <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4">
            Conclusion
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold gradient-text mb-16 leading-tight">
            {conclusion.title}
          </h1>

          {/* Key Takeaways */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
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
                  <span className="text-[#2563EB] font-mono text-xs mt-1 flex-shrink-0 w-6">
                    0{i + 1}
                  </span>
                  <p className="text-[#A1A1AA] text-base leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* How to Apply */}
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
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
                  <span className="text-[#2563EB] font-mono text-xs mt-1 flex-shrink-0 w-6">
                    0{i + 1}
                  </span>
                  <p className="text-[#A1A1AA] text-base leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* 30-Day Challenge */}
          <div className="bg-[#0F0F0F] border border-[#2563EB]/20 rounded-2xl p-8 md:p-10 mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              30-Day Challenge
            </h2>
            <p className="text-[#A1A1AA] text-base leading-relaxed">
              {conclusion.challenge}
            </p>
          </div>

          {/* Final Thought */}
          <div className="mb-20 text-center py-12">
            <blockquote className="text-xl md:text-2xl font-bold text-white/60 italic max-w-2xl mx-auto leading-relaxed">
              "{conclusion.final_thought}"
            </blockquote>
          </div>

          {/* CTA */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/explore"
              data-testid="conclusion-explore-btn"
              className="rounded-full px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center"
            >
              Explore Models
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/journal"
              data-testid="conclusion-journal-btn"
              className="rounded-full px-8 py-4 bg-transparent border border-white/20 text-white hover:bg-white/5 transition-colors duration-200 flex items-center"
            >
              Start Journaling
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
