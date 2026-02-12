import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Brain, Target, Lightbulb, Compass, BookOpen, Cpu, ArrowRight } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import axios from "axios";

 // Διαγράφεις αυτή τη γραμμή:
// const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

// Βάζεις αυτή τη γραμμή (hardcoded για να τελειώνουμε με τα 404):
const API = "http://127.0.0.1:8000/api";

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
  const [allModels, setAllModels] = useState([]);
  const { getReadCountForSection, totalRead } = useProgress();

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/sections`),
      axios.get(`${API}/models?limit=300`),
    ]).then(([secRes, modRes]) => {
      setSections(secRes.data);
      setAllModels(modRes.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="explore-page">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4">Domains</p>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-bold gradient-text mb-4">
            Thinking Spaces
          </h1>
          <div className="flex items-center gap-4 mb-16">
            <p className="text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
              Choose a domain to begin.
            </p>
            {totalRead > 0 && (
              <span className="blue-badge">{totalRead} / {allModels.length} read</span>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => {
            const Icon = sectionIcons[section.icon] || Brain;
            const readCount = getReadCountForSection(section.slug, allModels);
            const progressPercent = section.model_count > 0 ? Math.round((readCount / section.model_count) * 100) : 0;
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
                  className="bg-[#0F0F0F] border border-white/5 p-8 md:p-10 rounded-2xl hover:border-blue-500/30 transition-colors duration-300 card-hover group block"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-xl bg-[#2563EB]/10 flex items-center justify-center group-hover:bg-[#2563EB]/20 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-[#2563EB]" strokeWidth={1.5} />
                    </div>
                    <span className="blue-badge">{section.model_count} Models</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">{section.short_name}</h2>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-6">{section.description}</p>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#A1A1AA] font-mono">{readCount}/{section.model_count} read</span>
                      <span className="text-[#2563EB] font-mono">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#2563EB] text-xs font-mono">Section {String(section.index).padStart(2, '0')}</span>
                    <ArrowRight size={16} className="text-white/30 group-hover:text-[#2563EB] group-hover:translate-x-1 transition-transform duration-200" />
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
