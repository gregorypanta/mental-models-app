import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, PenLine } from "lucide-react";
import axios from "axios";

const baseAPI = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";
const API = baseAPI.endsWith('/') ? baseAPI.slice(0, -1) : baseAPI;

export default function JournalPage() {
  const [searchParams] = useSearchParams();
  const modelTitle = searchParams.get("model") || "";
  const sectionSlug = searchParams.get("section") || "";

  const [content, setContent] = useState("");
  const [entries, setEntries] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data } = await axios.get(`${API}/journal`);
      setEntries(data);
    } catch (e) {
      console.error(e);
    }
  };

  const saveEntry = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API}/journal`, {
        content: content.trim(),
        model_title: modelTitle || null,
        section_slug: sectionSlug || null,
      });
      setContent("");
      await loadEntries();
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`${API}/journal/${id}`);
      await loadEntries();
    } catch (e) {
      console.error(e);
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="journal-page">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <PenLine size={18} strokeWidth={1.5} className="text-[#2563EB]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono">Reflection</p>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-bold gradient-text mb-4">
            Journal
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-lg mb-16 leading-relaxed">
            Capture your reflections as you explore mental models. Writing clarifies thinking.
          </p>

          {/* Writing Area */}
          <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 md:p-8 mb-8">
            {modelTitle && (
              <p className="text-[#2563EB] text-xs font-mono mb-4">
                Reflecting on: {modelTitle}
              </p>
            )}
            <textarea
              data-testid="journal-textarea"
              className="journal-textarea"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? How does this model apply to your situation?"
            />
            <div className="flex justify-end mt-4">
              <button
                data-testid="save-journal-btn"
                onClick={saveEntry}
                disabled={!content.trim() || saving}
                className="rounded-full px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold hover:scale-105 transition-transform duration-200 disabled:opacity-30 disabled:hover:scale-100"
              >
                {saving ? "Saving..." : "Save Reflection"}
              </button>
            </div>
          </div>

          {/* Entries */}
          {entries.length > 0 && (
            <div>
              <p className="text-[#A1A1AA] font-mono text-xs mb-6">
                {entries.length} reflection{entries.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-4">
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                    className="bg-[#0F0F0F] border border-white/5 rounded-xl p-6 group hover:border-blue-500/20 transition-colors duration-300"
                    data-testid={`journal-entry-${i}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[#A1A1AA] font-mono text-xs">
                          {formatDate(entry.created_at)}
                        </span>
                        {entry.model_title && (
                          <span className="blue-badge">
                            {entry.model_title}
                          </span>
                        )}
                      </div>
                      <button
                        data-testid={`delete-entry-${i}`}
                        onClick={() => deleteEntry(entry.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-white/20 hover:text-red-400/60 transition-opacity duration-200"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p className="text-[#A1A1AA] text-sm leading-relaxed whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
