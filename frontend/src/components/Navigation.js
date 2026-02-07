import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, BookOpen, Map, PenLine, Menu, X, Brain } from "lucide-react";

export const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  const links = [
    { to: "/explore", label: "Explore", icon: BookOpen },
    { to: "/mindmap", label: "Mind Map", icon: Map },
    { to: "/search", label: "Search", icon: Search },
    { to: "/journal", label: "Journal", icon: PenLine },
  ];

  return (
    <nav
      data-testid="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-[#050505]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            data-testid="nav-logo"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          >
            <Brain size={22} strokeWidth={1.5} className="text-[#2563EB]" />
            <span className="font-bold text-lg tracking-tight text-white">
              AI-Powered Mind
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`nav-${link.label.toLowerCase().replace(' ', '-')}`}
                className={`nav-link flex items-center gap-2 text-sm font-medium tracking-wide transition-colors duration-200 ${
                  isActive(link.to) ? "active" : ""
                }`}
              >
                <link.icon size={16} strokeWidth={1.5} />
                {link.label}
              </Link>
            ))}
          </div>

          <button
            data-testid="mobile-menu-toggle"
            className="md:hidden p-2 text-white/60 hover:text-white transition-colors duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/5">
          <div className="px-6 py-6 flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-testid={`mobile-nav-${link.label.toLowerCase().replace(' ', '-')}`}
                className={`flex items-center gap-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive(link.to) ? "text-[#2563EB]" : "text-white/50 hover:text-white/80"
                }`}
              >
                <link.icon size={18} strokeWidth={1.5} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
