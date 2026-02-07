import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import ExplorePage from "@/pages/ExplorePage";
import DomainPage from "@/pages/DomainPage";
import ModelDetailPage from "@/pages/ModelDetailPage";
import SearchPage from "@/pages/SearchPage";
import JournalPage from "@/pages/JournalPage";
import MindMapPage from "@/pages/MindMapPage";
import ConclusionPage from "@/pages/ConclusionPage";
import Navigation from "@/components/Navigation";

function App() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="grain-overlay" />
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
