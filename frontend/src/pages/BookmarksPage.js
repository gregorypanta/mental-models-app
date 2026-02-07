import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";
import { useProgress } from "@/context/ProgressContext";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function BookmarksPage() {
  const { bookmarks, toggleBookmark } = useProgress();
  const [allModels, setAllModels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/models?limit=300`).then((r) => {
      setAllModels(r.data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  const bookmarkedModels = allModels.filter((m) => bookmarks.includes(m.id));

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="bookmarks-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <Bookmark size={18} className="text-[#2563EB]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono">Library</p>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-bold gradient-text mb-4">
            Saved Models
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-xl mb-16 leading-relaxed">
            Your personal collection of bookmarked mental models for quick reference.
          </p>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : bookmarkedModels.length > 0 ? (
            <div className="space-y-3">
              <p className="text-[#A1A1AA] text-xs font-mono mb-4">{bookmarkedModels.length} saved</p>
              {bookmarkedModels.map((model, i) => (
                <motion.div
                  key={model.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="flex items-center gap-4 p-4 bg-[#0F0F0F] border border-white/5 rounded-xl hover:border-[#2563EB]/30 transition-colors duration-200 group"
                >
                  <button
                    data-testid={`unbookmark-${model.id}`}
                    onClick={() => toggleBookmark(model.id)}
                    className="flex-shrink-0 p-1"
                  >
                    <Bookmark size={16} className="fill-[#2563EB] text-[#2563EB]" />
                  </button>
                  <Link
                    to={`/model/${model.section_slug}/${model.model_index}`}
                    className="flex-1 flex items-center justify-between min-w-0"
                  >
                    <div className="min-w-0">
                      <h3 className="font-bold text-sm text-white truncate">{model.title}</h3>
                      <p className="text-[#A1A1AA] text-xs mt-0.5">{model.section_name}</p>
                    </div>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-[#2563EB] flex-shrink-0 transition-colors duration-200" />
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Bookmark size={40} className="text-white/10 mx-auto mb-4" />
              <p className="text-[#A1A1AA] text-sm mb-2">No saved models yet</p>
              <p className="text-white/30 text-xs mb-6">Bookmark models while exploring to build your personal library</p>
              <Link
                to="/explore"
                className="rounded-full px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold hover:scale-105 transition-transform duration-200 inline-flex items-center gap-2"
              >
                Start Exploring <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
