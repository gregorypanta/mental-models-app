import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProgressProvider } from "@/context/ProgressContext";
import LandingPage from "@/pages/LandingPage";
import ExplorePage from "@/pages/ExplorePage";
import DomainPage from "@/pages/DomainPage";
import ModelDetailPage from "@/pages/ModelDetailPage";
import SearchPage from "@/pages/SearchPage";
import JournalPage from "@/pages/JournalPage";
import MindMapPage from "@/pages/MindMapPage";
import ConclusionPage from "@/pages/ConclusionPage";
import ChallengePage from "@/pages/ChallengePage";
import BookmarksPage from "@/pages/BookmarksPage";
import Navigation from "@/components/Navigation";

function App() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="grain-overlay" />
      <ProgressProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/mindmap" element={<MindMapPage />} />
            <Route path="/domain/:slug" element={<DomainPage />} />
            <Route path="/model/:sectionSlug/:modelIndex" element={<ModelDetailPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/conclusion" element={<ConclusionPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/bookmarks" element={<BookmarksPage />} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </div>
  );
}

export default App;
