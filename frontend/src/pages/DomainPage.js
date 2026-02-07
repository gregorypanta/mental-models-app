import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import CopyablePrompt from "@/components/CopyablePrompt";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function DomainPage() {
  const { slug } = useParams();
  const [models, setModels] = useState([]);
  const [sections, setSections] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);

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
            className="inline-flex items-center gap-2 text-white/40 text-sm mb-8 hover:text-white/60 transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            All Domains
          </Link>

          {currentSection && (
            <div className="mb-16">
              <p className="text-white/30 font-mono text-xs tracking-[0.3em] uppercase mb-4">
                Section {String(currentSection.index).padStart(2, '0')}
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-4">
                {currentSection.short_name}
              </h1>
              <p className="text-white/40 text-base max-w-xl leading-relaxed">
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
          <div className="space-y-4">
            {models.map((model, i) => {
              const isExpanded = expandedId === model.id;
              return (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.03 }}
                >
                  <div
                    className={`model-card cursor-pointer transition-colors duration-300 ${
                      isExpanded ? "border-white/15" : ""
                    }`}
                    data-testid={`model-card-${model.model_index}`}
                  >
                    <div
                      className="flex items-start justify-between gap-4"
                      onClick={() => setExpandedId(isExpanded ? null : model.id)}
                    >
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <span className="text-white/20 font-mono text-xs mt-1 flex-shrink-0 w-8">
                          {String(model.model_index).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-serif text-lg text-white tracking-tight">
                            {model.title}
                          </h3>
                          {!isExpanded && (
                            <p className="text-white/30 text-sm mt-1 line-clamp-1">
                              {model.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        data-testid={`toggle-model-${model.model_index}`}
                        className="flex-shrink-0 p-1 text-white/30 hover:text-white/60 transition-colors duration-200"
                      >
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pl-12 space-y-6"
                      >
                        <div>
                          <p className="text-white/20 font-mono text-xs uppercase tracking-wider mb-2">Explanation</p>
                          <p className="text-white/60 text-sm leading-relaxed">{model.explanation}</p>
                        </div>
                        <div>
                          <p className="text-white/20 font-mono text-xs uppercase tracking-wider mb-2">Example</p>
                          <p className="text-white/50 text-sm leading-relaxed italic">{model.example}</p>
                        </div>
                        <div>
                          <p className="text-white/20 font-mono text-xs uppercase tracking-wider mb-3">AI Prompt</p>
                          <CopyablePrompt prompt={model.ai_prompt} />
                        </div>
                        <Link
                          to={`/model/${model.section_slug}/${model.model_index}`}
                          data-testid={`view-model-detail-${model.model_index}`}
                          className="inline-flex items-center gap-2 text-white/40 text-xs hover:text-white/70 transition-colors duration-200 mt-2"
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

        {/* Navigation between sections */}
        <div className="mt-20 flex justify-between items-center border-t border-white/5 pt-12">
          {prevSection ? (
            <Link
              to={`/domain/${prevSection.slug}`}
              data-testid="prev-section"
              className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              {prevSection.short_name}
            </Link>
          ) : <div />}
          {nextSection ? (
            <Link
              to={`/domain/${nextSection.slug}`}
              data-testid="next-section"
              className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors duration-200"
            >
              {nextSection.short_name}
              <ArrowRight size={14} />
            </Link>
          ) : (
            <Link
              to="/conclusion"
              data-testid="go-to-conclusion"
              className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors duration-200"
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
