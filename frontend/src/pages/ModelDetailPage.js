import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Bookmark, CheckCircle2 } from "lucide-react";
import axios from "axios";
import CopyablePrompt from "@/components/CopyablePrompt";
import { useProgress } from "@/context/ProgressContext";

// Χρησιμοποιούμε process.env και το πρόθεμα REACT_APP_ για Create React App
const API = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
const API = rawAPI.endsWith('/') ? rawAPI.slice(0, -1) : rawAPI;


export default function ModelDetailPage() {
  const { sectionSlug, modelIndex } = useParams();
  const [model, setModel] = useState(null);
  const [allModels, setAllModels] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const { markAsRead, isRead, toggleBookmark, isBookmarked } = useProgress();

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get(`${API}/models/${sectionSlug}/${modelIndex}`),
      axios.get(`${API}/models?section=${sectionSlug}`),
      axios.get(`${API}/models/${sectionSlug}/${modelIndex}/related`).catch(() => ({ data: [] })),
    ]).then(([modelRes, modelsRes, relatedRes]) => {
      setModel(modelRes.data);
      setAllModels(modelsRes.data);
      setRelated(relatedRes.data);
      setLoading(false);
      // Mark as read
      if (modelRes.data?.id) {
        markAsRead(modelRes.data.id);
      }
    }).catch(console.error);
  }, [sectionSlug, modelIndex, markAsRead]);

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

  const bookmarked = isBookmarked(model.id);
  const read = isRead(model.id);

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="model-detail-page">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-12">
            <Link
              to={`/domain/${sectionSlug}`}
              data-testid="back-to-domain"
              className="inline-flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200"
            >
              <ArrowLeft size={14} />
              {model.section_name}
            </Link>
            <div className="flex items-center gap-3">
              {read && (
                <span className="flex items-center gap-1 text-[#10B981] text-xs font-mono">
                  <CheckCircle2 size={14} /> Read
                </span>
              )}
              <button
                data-testid="bookmark-btn"
                onClick={() => toggleBookmark(model.id)}
                className="p-2 rounded-lg bg-[#0F0F0F] border border-white/5 hover:border-[#2563EB]/30 transition-colors duration-200"
              >
                <Bookmark size={16} className={bookmarked ? "fill-[#2563EB] text-[#2563EB]" : "text-[#A1A1AA]"} />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <span className="blue-badge">
              {String(model.section_index).padStart(2, '0')}.{String(model.model_index).padStart(2, '0')}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl tracking-tighter font-bold gradient-text mb-16 leading-tight">
            {model.title}
          </h1>

          {/* Explanation */}
          <div className="mb-16">
            <p className="text-[#2563EB] font-mono text-xs uppercase tracking-[0.2em] mb-4">Explanation</p>
            <p className="text-[#A1A1AA] text-lg leading-relaxed">{model.explanation}</p>
          </div>

          {/* Example */}
          <div className="mb-16">
            <p className="text-[#2563EB] font-mono text-xs uppercase tracking-[0.2em] mb-4">Example</p>
            <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 md:p-8">
              <p className="text-white/50 text-base leading-relaxed italic">{model.example}</p>
            </div>
          </div>

          {/* AI Prompt */}
          <div className="mb-16">
            <p className="text-[#2563EB] font-mono text-xs uppercase tracking-[0.2em] mb-4">AI Prompt</p>
            <CopyablePrompt prompt={model.ai_prompt} />
          </div>

          {/* Related Models */}
          {related.length > 0 && (
            <div className="mb-16">
              <p className="text-[#2563EB] font-mono text-xs uppercase tracking-[0.2em] mb-4">Related Models</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    to={`/model/${r.section_slug}/${r.model_index}`}
                    data-testid={`related-model-${r.id}`}
                    className="p-4 bg-[#0F0F0F] border border-white/5 rounded-xl hover:border-[#2563EB]/30 transition-colors duration-200 group"
                  >
                    <h4 className="text-sm font-bold text-white truncate">{r.title}</h4>
                    <p className="text-[#A1A1AA] text-xs mt-1 truncate">{r.section_name}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Reflection CTA */}
          <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 md:p-8 mb-20">
            <p className="text-[#A1A1AA] text-sm mb-3">Reflect on this model</p>
            <Link
              to={`/journal?model=${encodeURIComponent(model.title)}&section=${sectionSlug}`}
              data-testid="reflect-btn"
              className="rounded-full px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold hover:scale-105 transition-transform duration-200 inline-flex items-center"
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
                className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200"
              >
                <ArrowLeft size={14} />
                <span className="max-w-[200px] truncate">{prevModel.title}</span>
              </Link>
            ) : <div />}
            {nextModel ? (
              <Link
                to={`/model/${sectionSlug}/${nextModel.model_index}`}
                data-testid="next-model"
                className="flex items-center gap-2 text-[#A1A1AA] text-sm hover:text-white transition-colors duration-200"
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
