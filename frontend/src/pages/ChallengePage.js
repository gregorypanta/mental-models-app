import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, Check, Flame, ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import axios from "axios";

// Χρησιμοποιούμε process.env και το πρόθεμα REACT_APP_ για Create React App
const rawAPI = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";
const API = rawAPI.endsWith('/') ? rawAPI.slice(0, -1) : rawAPI;

export default function ChallengePage() {
  const [challenge, setChallenge] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [logs, setLogs] = useState([]);
  const [reflection, setReflection] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [challengeRes, sectionsRes, modelsRes] = await Promise.all([
        axios.get(`${API}/challenge/active`),
        axios.get(`${API}/sections`),
        axios.get(`${API}/models?limit=300`),
      ]);
      setChallenge(challengeRes.data);
      setSections(sectionsRes.data);
      setModels(modelsRes.data);
      if (challengeRes.data?.id) {
        const logsRes = await axios.get(`${API}/challenge/logs?challenge_id=${challengeRes.data.id}`);
        setLogs(logsRes.data);
      }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((i) => i !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const startChallenge = async () => {
    if (selectedIds.length !== 5) return;
    setCreating(true);
    try {
      await axios.post(`${API}/challenge`, { model_ids: selectedIds });
      setSelectedIds([]);
      await loadData();
    } catch (e) { console.error(e); }
    setCreating(false);
  };

  const completeDay = async (day) => {
    try {
      await axios.post(`${API}/challenge/complete-day`, {
        day,
        reflection: reflection.trim() || null,
      });
      setReflection("");
      await loadData();
    } catch (e) { console.error(e); }
  };

  const resetChallenge = async () => {
    if (!challenge) return;
    try {
      await axios.delete(`${API}/challenge/${challenge.id}`);
      setChallenge(null);
      setLogs([]);
    } catch (e) { console.error(e); }
  };

  const filteredModels = activeSection
    ? models.filter((m) => m.section_slug === activeSection)
    : models;

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-24">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/5 rounded w-64" />
            <div className="h-6 bg-white/5 rounded w-96" />
            <div className="h-64 bg-white/5 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Active challenge view
  if (challenge) {
    const completed = challenge.completed_days || [];
    const todayCompleted = completed.includes(challenge.current_day);
    const progressPercent = Math.round((completed.length / 30) * 100);

    return (
      <div className="min-h-screen pt-28 pb-24" data-testid="challenge-page-active">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy size={18} className="text-[#2563EB]" />
                <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono">30-Day Challenge</p>
              </div>
              <button
                data-testid="reset-challenge-btn"
                onClick={resetChallenge}
                className="flex items-center gap-1.5 text-xs text-[#A1A1AA] hover:text-white transition-colors duration-200"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
            <h1 className="text-4xl md:text-5xl tracking-tighter font-bold gradient-text mb-2">
              Day {challenge.current_day} of 30
            </h1>

            {/* Streak & Progress */}
            <div className="flex items-center gap-6 mb-10 mt-4">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-400" />
                <span className="text-white font-bold text-lg">{challenge.streak}</span>
                <span className="text-[#A1A1AA] text-sm">day streak</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#2563EB] font-bold text-lg">{progressPercent}%</span>
                <span className="text-[#A1A1AA] text-sm">complete</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-[#0F0F0F] rounded-full mb-10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full bg-[#2563EB] rounded-full"
              />
            </div>

            {/* Calendar Grid */}
            <div className="mb-12">
              <h3 className="text-sm font-bold text-white mb-4">Progress Calendar</h3>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
                {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                  const done = completed.includes(day);
                  const isCurrent = day === challenge.current_day;
                  const isFuture = day > challenge.current_day;
                  return (
                    <div
                      key={day}
                      data-testid={`challenge-day-${day}`}
                      className={`aspect-square rounded-xl flex items-center justify-center text-xs font-bold transition-colors duration-200 ${
                        done
                          ? "bg-[#2563EB] text-white"
                          : isCurrent
                          ? "bg-[#2563EB]/20 text-[#2563EB] border border-[#2563EB]/50"
                          : isFuture
                          ? "bg-[#0F0F0F] text-white/20"
                          : "bg-[#0F0F0F] text-[#A1A1AA]"
                      }`}
                    >
                      {done ? <Check size={14} /> : day}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Models */}
            <div className="mb-12">
              <h3 className="text-sm font-bold text-white mb-4">Today's 5 Models to Practice</h3>
              <div className="space-y-2">
                {challenge.model_titles.map((title, i) => (
                  <Link
                    key={i}
                    to={`/model/${challenge.model_slugs[i]}/${challenge.model_indices[i]}`}
                    data-testid={`challenge-model-${i}`}
                    className="flex items-center gap-3 p-4 bg-[#0F0F0F] border border-white/5 rounded-xl hover:border-[#2563EB]/30 transition-colors duration-200 group"
                  >
                    <span className="text-[#2563EB] font-mono text-xs w-6">0{i + 1}</span>
                    <span className="text-white font-medium text-sm flex-1">{title}</span>
                    <ArrowRight size={14} className="text-white/20 group-hover:text-[#2563EB] transition-colors duration-200" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Complete Today */}
            {!todayCompleted ? (
              <div className="bg-[#0F0F0F] border border-[#2563EB]/20 rounded-2xl p-6 md:p-8 mb-10">
                <h3 className="text-lg font-bold text-white mb-4">Complete Day {challenge.current_day}</h3>
                <p className="text-[#A1A1AA] text-sm mb-4">Optional: write a short reflection on what you practiced today.</p>
                <textarea
                  data-testid="challenge-reflection"
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  placeholder="What did you learn or apply today?"
                  className="w-full bg-transparent border border-white/10 rounded-xl p-4 text-sm text-white placeholder:text-white/20 focus:border-[#2563EB]/50 focus:outline-none mb-4 min-h-[100px] resize-none"
                />
                <button
                  data-testid="complete-day-btn"
                  onClick={() => completeDay(challenge.current_day)}
                  className="rounded-full px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-sm font-bold hover:scale-105 transition-transform duration-200 flex items-center gap-2"
                >
                  <Check size={14} /> Mark Day {challenge.current_day} Complete
                </button>
              </div>
            ) : (
              <div className="bg-[#0F0F0F] border border-[#10B981]/20 rounded-2xl p-6 text-center mb-10">
                <Sparkles size={24} className="text-[#10B981] mx-auto mb-3" />
                <p className="text-[#10B981] font-bold">Day {challenge.current_day} completed!</p>
                <p className="text-[#A1A1AA] text-sm mt-1">Come back tomorrow to keep your streak going.</p>
              </div>
            )}

            {/* Logs */}
            {logs.length > 0 && (
              <div>
                <h3 className="text-sm font-bold text-white mb-4">Reflections Log</h3>
                <div className="space-y-3">
                  {logs.filter((l) => l.reflection).map((log, i) => (
                    <div key={i} className="bg-[#0F0F0F] border border-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="blue-badge">Day {log.day}</span>
                        <span className="text-[#A1A1AA] text-xs font-mono">
                          {new Date(log.completed_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[#A1A1AA] text-sm">{log.reflection}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  // Setup view - pick 5 models
  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="challenge-page-setup">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center gap-3 mb-4">
            <Trophy size={18} className="text-[#2563EB]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#2563EB] font-mono">30-Day Challenge</p>
          </div>
          <h1 className="text-4xl md:text-6xl tracking-tighter font-bold gradient-text mb-4">
            Transform Your Thinking
          </h1>
          <p className="text-[#A1A1AA] text-lg max-w-xl mb-4 leading-relaxed">
            Pick 5 mental models from different sections. Practice them daily for 30 days. Track your progress and reflect on your growth.
          </p>
          <p className="text-[#2563EB] text-sm font-mono mb-12">
            {selectedIds.length}/5 models selected
          </p>

          {/* Section filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveSection(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 ${
                !activeSection ? "bg-[#2563EB] text-white" : "border border-white/15 text-[#A1A1AA] hover:text-white"
              }`}
            >
              All
            </button>
            {sections.map((s) => (
              <button
                key={s.slug}
                onClick={() => setActiveSection(activeSection === s.slug ? null : s.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 ${
                  activeSection === s.slug ? "bg-[#2563EB] text-white" : "border border-white/15 text-[#A1A1AA] hover:text-white"
                }`}
              >
                {s.short_name}
              </button>
            ))}
          </div>

          {/* Model selection grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-12">
            {filteredModels.map((model) => {
              const isSelected = selectedIds.includes(model.id);
              return (
                <button
                  key={model.id}
                  onClick={() => toggleSelect(model.id)}
                  data-testid={`select-model-${model.section_slug}-${model.model_index}`}
                  className={`text-left p-4 rounded-xl border transition-colors duration-200 ${
                    isSelected
                      ? "bg-[#2563EB]/10 border-[#2563EB]/40"
                      : "bg-[#0F0F0F] border-white/5 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 ${
                      isSelected ? "bg-[#2563EB] border-[#2563EB]" : "border-white/20"
                    }`}>
                      {isSelected && <Check size={12} className="text-white" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">{model.title}</p>
                      <p className="text-[#A1A1AA] text-xs truncate">{model.section_name}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Start button */}
          <div className="sticky bottom-6 flex justify-center">
            <button
              data-testid="start-challenge-btn"
              onClick={startChallenge}
              disabled={selectedIds.length !== 5 || creating}
              className="rounded-full px-10 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold tracking-wide hover:scale-105 transition-transform duration-200 shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-30 disabled:hover:scale-100 flex items-center gap-2"
            >
              <Trophy size={16} />
              {creating ? "Starting..." : "Start 30-Day Challenge"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
