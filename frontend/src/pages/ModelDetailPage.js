import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import axios from "axios";
import CopyablePrompt from "@/components/CopyablePrompt";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function ModelDetailPage() {
  const { sectionSlug, modelIndex } = useParams();
  const [model, setModel] = useState(null);
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/models/${sectionSlug}/${modelIndex}`),
      axios.get(`${API}/models?section=${sectionSlug}`),
    ]).then(([modelRes, modelsRes]) => {
      setModel(modelRes.data);
      setAllModels(modelsRes.data);
      setLoading(false);
    }).catch(console.error);
  }, [sectionSlug, modelIndex]);

  const idx = parseInt(modelIndex);
  const prevModel = allModels.find((m) => m.model_index === idx - 1);
  const nextModel = allModels.find((m) => m.model_index === idx + 1);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-white/5 rounded w-64" />
            <div className="h-12 bg-white/5 rounded w-96" />
            <div className="h-32 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!model) return null;

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="model-detail-page">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to={`/domain/${sectionSlug}`}
            data-testid="back-to-domain"
            className="inline-flex items-center gap-2 text-white/40 text-sm mb-12 hover:text-white/60 transition-colors duration-200"
          >
            <ArrowLeft size={14} />
            {model.section_name}
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-white/20 font-mono text-xs">
              {String(model.section_index).padStart(2, '0')}.{String(model.model_index).padStart(2, '0')}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-16 leading-tight">
            {model.title}
          </h1>

          {/* Explanation */}
          <div className="mb-16">
            <p className="text-white/25 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              Explanation
            </p>
            <p className="text-white/70 text-base md:text-lg leading-relaxed">
              {model.explanation}
            </p>
          </div>

          {/* Example */}
          <div className="mb-16">
            <p className="text-white/25 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              Example
            </p>
            <div className="glass-card rounded-2xl p-6 md:p-8">
              <p className="text-white/50 text-base leading-relaxed italic">
                {model.example}
              </p>
            </div>
          </div>

          {/* AI Prompt */}
          <div className="mb-20">
            <p className="text-white/25 font-mono text-xs uppercase tracking-[0.2em] mb-4">
              AI Prompt
            </p>
            <CopyablePrompt prompt={model.ai_prompt} />
          </div>

          {/* Reflection CTA */}
          <div className="glass-card rounded-2xl p-6 md:p-8 mb-20">
            <p className="text-white/40 text-sm mb-3">Reflect on this model</p>
            <Link
              to={`/journal?model=${encodeURIComponent(model.title)}&section=${sectionSlug}`}
              data-testid="reflect-btn"
              className="inline-flex items-center justify-center rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-200 gap-2"
            >
              Open Journal
            </Link>
          </div>

          {/* Prev/Next */}
          <div className="flex justify-between items-center border-t border-white/5 pt-12">
            {prevModel ? (
              <Link
                to={`/model/${sectionSlug}/${prevModel.model_index}`}
                data-testid="prev-model"
                className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors duration-200"
              >
                <ArrowLeft size={14} />
                <span className="max-w-[200px] truncate">{prevModel.title}</span>
              </Link>
            ) : <div />}
            {nextModel ? (
              <Link
                to={`/model/${sectionSlug}/${nextModel.model_index}`}
                data-testid="next-model"
                className="flex items-center gap-2 text-white/40 text-sm hover:text-white/60 transition-colors duration-200"
              >
                <span className="max-w-[200px] truncate">{nextModel.title}</span>
                <ArrowRight size={14} />
              </Link>
            ) : <div />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
