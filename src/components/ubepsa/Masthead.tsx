import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const NAV: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Stories", to: "/articles" },
  { label: "Gallery", to: "/gallery" },
  { label: "Press", to: "/press" },
  { label: "About", to: "/about" },
];

export function Masthead() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 200 && y > lastY) setHidden(true); else setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-transform duration-500 ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className={`mx-auto transition-all duration-500 ${scrolled ? "mt-2 sm:mt-3 max-w-5xl px-2 sm:px-3" : "mt-0 max-w-7xl px-4"}`}>
          <div
            className={`flex items-center justify-between transition-all duration-500 ${
              scrolled
                ? "rounded-full border border-white/10 bg-[#0A0A1A]/70 backdrop-blur-xl px-4 sm:px-6 py-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
                : "py-5"
            }`}
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5 min-w-0">
              <span className="relative inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-gradient-to-br from-sky-400 to-sky-200 shadow-[0_8px_24px_-8px_rgba(56,189,248,0.8)]">
                <span className="font-display text-[#04121E] text-lg leading-none">U</span>
                <span className="absolute inset-0 rounded-md ring-1 ring-white/20" />
              </span>
              <span className="font-display text-lg sm:text-xl leading-none text-ink truncate">
                UBEPSA <span className="text-gradient">Press</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ "data-active": "true", className: "text-ink" } as never}
                  className="nav-link kicker text-ink/65 hover:text-ink px-3.5 py-2 transition-colors"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              <Link to="/admin" className="kicker text-ink/50 hover:text-ink transition-colors px-3 py-2">Admin</Link>
              <Link to="/articles" className="btn-primary !py-2.5 !px-4 text-[0.62rem]">
                Read latest
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5 text-ink"
            >
              <span className={`block h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`block h-px w-6 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[3px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-all duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-[#050510]/95 backdrop-blur-2xl" onClick={() => setMenuOpen(false)} />
        <nav className="relative h-full flex flex-col items-center justify-center px-6">
          <ul className="space-y-5 text-center">
            {[...NAV, { label: "Admin", to: "/admin" }].map((n, i) => (
              <li
                key={n.to}
                style={{ transitionDelay: menuOpen ? `${i * 50 + 100}ms` : "0ms" }}
                className={`transition-all duration-500 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-gradient" } as never}
                  className="font-display text-4xl text-ink"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/articles" onClick={() => setMenuOpen(false)} className="btn-primary mt-12">
            Read latest →
          </Link>
        </nav>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 sm:mt-32 surface-ink overflow-hidden grain border-t border-white/5">
      <div className="absolute inset-x-0 -bottom-6 flex justify-center pointer-events-none select-none">
        <span className="giant-wordmark">PhysioVibes</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <span className="kicker text-gradient">The publication</span>
          <h3 className="font-display text-3xl sm:text-4xl mt-3 text-ink max-w-md leading-tight">
            A new standard in editorial — engineered for taste.
          </h3>
          <p className="mt-4 text-ink/55 max-w-md text-sm leading-relaxed">
            PhysioVibes is the independent voice of UBEPSA — long-form stories, photography, and dispatches on culture, campus, and the future.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/articles" className="btn-primary">Subscribe →</Link>
          </div>
        </div>
        <div>
          <h4 className="kicker text-ink/50 mb-4">Sections</h4>
          <ul className="space-y-2.5 text-sm text-ink/70">
            <li><Link to="/articles" className="ink-link">Stories</Link></li>
            <li><Link to="/gallery" className="ink-link">Gallery</Link></li>
            <li><Link to="/press" className="ink-link">Press</Link></li>
            <li><Link to="/about" className="ink-link">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="kicker text-ink/50 mb-4">Contact</h4>
          <ul className="space-y-2.5 text-sm text-ink/70 break-words">
            <li>@official_editorialpress</li>
            <li>ubepsaeditorial@gmail.com</li>
            <li>Dept. of Physiotherapy</li>
            <li>University of Benin</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-ink/40">
          <span>© {new Date().getFullYear()} PhysioVibes / UBEPSA</span>
          <span>Crafted with care — Midnight Indigo Edition</span>
        </div>
      </div>
    </footer>
  );
}
