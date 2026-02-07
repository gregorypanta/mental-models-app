import { createContext, useContext, useState, useEffect, useCallback } from "react";

const ProgressContext = createContext();

export function ProgressProvider({ children }) {
  const [readModels, setReadModels] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("apm_read_models") || "[]");
    } catch { return []; }
  });

  const [bookmarks, setBookmarks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("apm_bookmarks") || "[]");
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("apm_read_models", JSON.stringify(readModels));
  }, [readModels]);

  useEffect(() => {
    localStorage.setItem("apm_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  const markAsRead = useCallback((modelId) => {
    setReadModels((prev) => {
      if (prev.includes(modelId)) return prev;
      return [...prev, modelId];
    });
  }, []);

  const isRead = useCallback((modelId) => readModels.includes(modelId), [readModels]);

  const toggleBookmark = useCallback((modelId) => {
    setBookmarks((prev) => {
      if (prev.includes(modelId)) return prev.filter((id) => id !== modelId);
      return [...prev, modelId];
    });
  }, []);

  const isBookmarked = useCallback((modelId) => bookmarks.includes(modelId), [bookmarks]);

  const getReadCountForSection = useCallback((sectionSlug, allModels) => {
    return allModels.filter(
      (m) => m.section_slug === sectionSlug && readModels.includes(m.id)
    ).length;
  }, [readModels]);

  return (
    <ProgressContext.Provider value={{
      readModels, markAsRead, isRead,
      bookmarks, toggleBookmark, isBookmarked,
      getReadCountForSection,
      totalRead: readModels.length,
      totalBookmarked: bookmarks.length,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export const useProgress = () => useContext(ProgressContext);
