import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Bookmark, CheckCircle2 } from "lucide-react";
import axios from "axios";
import CopyablePrompt from "@/components/CopyablePrompt";
import { useProgress } from "@/context/ProgressContext";

// Χρησιμοποιούμε process.env και το πρόθεμα REACT_APP_ για Create React App
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
const API = baseAPI.endsWith('/') ? baseAPI.slice(0, -1) : baseAPI;

export default function DomainPage() {
  const { slug } = useParams();
  const [models, setModels] = useState([]);
  const [sections, setSections] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isRead, isBookmarked, toggleBookmark } = useProgress();

  const currentSection = sections.find((s) => s.slug === slug);

  useEffect(() => {
    setLoading(true);
    setExpandedId(null);
    Promise.all([
      axios.get(`${API}/models?section=${slug}`),
      axios.get(`${API}/sections`),
    ]).then(([modelsRes, sectionsRes]) => {
      setModels(modelsRes.data);
      setSections(sectionsRes.data);
      setLoading(false);
    }).catch(console.error);
  }, [slug]);

  const currentIdx = sections.findIndex((s) => s.slug === slug);
  const prevSection = currentIdx > 0 ? sections[currentIdx - 1] : null;
  const nextSection = currentIdx < sections.length - 1 ? sections[currentIdx + 1] : null;

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="domain-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/explore"
            data-testid="back-to-explore"
            className="inline-flex items-center gap-2 text-[#A1A1AA] text-sm mb-8 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            All Domains
          </Link>

          {currentSection && (
            <div className="mb-16">
              <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono mb-4">
                Section {String(currentSection.index).padStart(2, '0')}
              </p>
              <h1 className="text-4xl md:text-6xl tracking-tighter font-bold gradient-text mb-4">
                {currentSection.short_name}
              </h1>
              <p className="text-[#A1A1AA] text-lg max-w-xl leading-relaxed">
                {currentSection.description}
              </p>
            </div>
          )}
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="model-card animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {models.map((model, i) => {
              const isExpanded = expandedId === model.id;
              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                >
                  <div
                    className={`model-card cursor-pointer ${
                      isExpanded ? "border-[#2563EB]/30 shadow-[0_0_20px_rgba(37,99,235,0.1)]" : ""
                    }`}
                    data-testid={`model-card-${model.model_index}`}
                  >
                    <div
                      className="flex items-start justify-between gap-4"
                      onClick={() => setExpandedId(isExpanded ? null : model.id)}
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <span className="text-[#2563EB]/50 font-mono text-xs mt-1 flex-shrink-0 w-8">
                          {String(model.model_index).padStart(2, '0')}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {isRead(model.id) && <CheckCircle2 size={14} className="text-[#10B981] flex-shrink-0" />}
                            <h3 className="text-lg font-bold text-white">
                              {model.title}
                            </h3>
                          </div>
                          {!isExpanded && (
                            <p className="text-[#A1A1AA] text-sm mt-1 line-clamp-1">
                              {model.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleBookmark(model.id); }}
                          className="p-1 transition-colors duration-200"
                        >
                          <Bookmark size={14} className={isBookmarked(model.id) ? "fill-[#2563EB] text-[#2563EB]" : "text-white/20 hover:text-white/40"} />
                        </button>
                        <button
                          data-testid={`toggle-model-${model.model_index}`}
                          className="p-1 text-[#A1A1AA] hover:text-[#2563EB] transition-colors duration-200"
                        >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pl-12 space-y-6"
                      >
                        <div>
                          <p className="text-[#2563EB] font-mono text-xs uppercase tracking-wider mb-2">Explanation</p>
                          <p className="text-[#A1A1AA] text-sm leading-relaxed">{model.explanation}</p>
                        </div>
                        <div>
                          <p className="text-[#2563EB] font-mono text-xs uppercase tracking-wider mb-2">Example</p>
                          <p className="text-white/50 text-sm leading-relaxed italic">{model.example}</p>
                        </div>
                        <div>
                          <p className="text-[#2563EB] font-mono text-xs uppercase tracking-wider mb-3">AI Prompt</p>
                          <CopyablePrompt prompt={model.ai_prompt} />
                        </div>
                        <Link
                          to={`/model/${model.section_slug}/${model.model_index}`}
                          data-testid={`view-model-detail-${model.model_index}`}
                          className="inline-flex items-center gap-2 text-[#2563EB] text-xs font-medium hover:text-[#3B82F6] transition-colors duration-200 mt-2"
                        >
                          Open full view <ArrowRight size={12} />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-20 flex justify-between items-center border-t border-white/5 pt-12">
          {prevSection ? (
            <Link
              to={`/domain/${prevSection.slug}`}
              data-testid="prev-section"
              className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              {prevSection.short_name}
            </Link>
          ) : <div />}
          {nextSection ? (
            <Link
              to={`/domain/${nextSection.slug}`}
              data-testid="next-section"
              className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200"
            >
              {nextSection.short_name}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              to="/conclusion"
              data-testid="go-to-conclusion"
              className="flex items-center gap-2 text-[#2563EB] text-sm font-medium hover:text-[#3B82F6] transition-colors duration-200"
            >
              Conclusion
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
