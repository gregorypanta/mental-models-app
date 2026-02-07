import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import axios from "axios";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [sections, setSections] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    axios.get(`${API}/sections`).then((r) => setSections(r.data)).catch(console.error);
  }, []);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setHasSearched(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("search", query.trim());
      if (activeFilter) params.set("section", activeFilter);
      params.set("limit", "300");
      const { data } = await axios.get(`${API}/models?${params}`);
      setResults(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, [query, activeFilter]);

  // Load all models on initial mount so page is not empty
  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API}/models?limit=300`);
        setResults(data);
        setHasSearched(true);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadAll();
  }, []);

  useEffect(() => {
    const timer = setTimeout(doSearch, 300);
    return () => clearTimeout(timer);
  }, [query, activeFilter, doSearch]);

  return (
    <div className="min-h-screen pt-28 pb-24" data-testid="search-page">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-white/40 font-mono text-xs tracking-[0.3em] uppercase mb-4">Search</p>
          <h1 className="font-serif text-3xl sm:text-4xl tracking-tight text-white mb-12">
            Find a Model
          </h1>

          {/* Search Input */}
          <div className="relative mb-8">
            <Search size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              data-testid="search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search 200+ mental models..."
              className="w-full h-12 border-b border-white/20 bg-transparent pl-8 pr-10 text-sm text-white placeholder:text-white/25 focus:border-white/50 focus:outline-none"
            />
            {query && (
              <button
                data-testid="clear-search"
                onClick={() => { setQuery(""); setHasSearched(false); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-white/30 hover:text-white/60 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-12">
            <button
              data-testid="filter-all"
              onClick={() => setActiveFilter(null)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${
                !activeFilter
                  ? "bg-white text-black"
                  : "border border-white/15 text-white/50 hover:text-white/80 hover:border-white/30"
              }`}
            >
              All
            </button>
            {sections.map((s) => (
              <button
                key={s.slug}
                data-testid={`filter-${s.slug}`}
                onClick={() => setActiveFilter(activeFilter === s.slug ? null : s.slug)}
                className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors duration-200 ${
                  activeFilter === s.slug
                    ? "bg-white text-black"
                    : "border border-white/15 text-white/50 hover:text-white/80 hover:border-white/30"
                }`}
              >
                {s.short_name}
              </button>
            ))}
          </div>

          {/* Results */}
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-white/3 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <div className="space-y-2">
                <p className="text-white/30 text-xs font-mono mb-6">{results.length} results</p>
                {results.map((model, i) => (
                  <motion.div
                    key={model.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                  >
                    <Link
                      to={`/model/${model.section_slug}/${model.model_index}`}
                      data-testid={`search-result-${i}`}
                      className="flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-colors duration-200 group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="text-white/15 font-mono text-xs flex-shrink-0 w-10">
                          {String(model.section_index).padStart(2, '0')}.{String(model.model_index).padStart(2, '0')}
                        </span>
                        <div className="min-w-0">
                          <h3 className="font-serif text-sm text-white truncate">{model.title}</h3>
                          <p className="text-white/30 text-xs mt-0.5 truncate">{model.section_name}</p>
                        </div>
                      </div>
                      <ArrowRight size={14} className="text-white/20 group-hover:text-white/50 flex-shrink-0 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-white/30 text-sm">No models found for "{query}"</p>
              </div>
            )
          ) : (
            <div className="text-center py-20">
              <p className="text-white/20 text-sm">Start typing or select a domain to browse</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
