import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";

const NAV: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Magazine", to: "/articles" },
  { label: "Gallery", to: "/gallery" },
  { label: "Press", to: "/press" },
  { label: "About", to: "/about" },
  { label: "Admin", to: "/admin" },
];

export function Masthead() {
  const { breaking } = useUbepsa();
  const [shrunk, setShrunk] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setShrunk(y > 80);
      if (y > 200 && y > lastY) setHidden(true);
      else setHidden(false);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const ticker = breaking.map(b => b.text);

  return (
    <>
      {/* Top ticker — always visible at top */}
      {ticker.length > 0 && (
        <div className="surface-ink border-b border-white/5 overflow-hidden">
          <div className="flex items-center">
            <span className="font-mono text-[0.55rem] sm:text-[0.6rem] tracking-[0.2em] sm:tracking-[0.25em] font-semibold bg-press-red text-ink px-2 sm:px-3 py-1.5 shrink-0">LIVE</span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-track py-1.5 text-[0.7rem] sm:text-xs font-mono tracking-wider">
                {[...ticker, ...ticker].map((t, i) => (
                  <span key={i} className="px-6 sm:px-8 inline-flex items-center gap-3 text-ink/80">
                    <span className="text-gold">◆</span>{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating nav */}
      <header
        className={`sticky top-0 z-40 transition-all duration-500 ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`transition-all duration-500 ${
            shrunk
              ? "mx-2 sm:mx-3 mt-2 sm:mt-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              : "border-b border-white/5 bg-paper/80 backdrop-blur-md"
          }`}
        >
          <div
            className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-500 ${
              shrunk ? "py-2.5" : "py-4 sm:py-5"
            }`}
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="group flex items-baseline gap-2 min-w-0">
              <span
                className={`font-display leading-none transition-all duration-500 truncate ${
                  shrunk ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl md:text-4xl"
                }`}
              >
                Physio<span className="text-press-red">V</span>ibes
              </span>
              {!shrunk && (
                <span className="hidden lg:inline kicker text-ink/40 ml-2">Issue 001</span>
              )}
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:block">
              <ul className="flex items-center">
                {NAV.map(n => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      activeOptions={{ exact: n.to === "/" }}
                      activeProps={{ "data-active": "true", className: "text-gold" } as never}
                      className="nav-link block kicker text-ink/75 px-3 lg:px-4 py-2 hover:text-gold transition-colors"
                    >
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

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

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-30 transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-paper/95 backdrop-blur-xl" onClick={() => setMenuOpen(false)} />
        <nav className="relative h-full flex items-center justify-center">
          <ul className="space-y-6 text-center">
            {NAV.map((n, i) => (
              <li
                key={n.to}
                style={{ transitionDelay: menuOpen ? `${i * 50 + 100}ms` : "0ms" }}
                className={`transition-all duration-500 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
              >
                <Link
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-gold" } as never}
                  className="font-display text-4xl text-ink hover:text-press-red transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 sm:mt-32 surface-ink overflow-hidden grain">
      <div className="absolute inset-x-0 -bottom-6 flex justify-center pointer-events-none select-none">
        <span className="giant-wordmark">PhysioVibes</span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-14 sm:py-20 grid gap-10 sm:gap-12 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2 md:col-span-2">
          <span className="kicker text-press-red">The publication</span>
          <h3 className="font-display text-3xl sm:text-4xl mt-3 text-ink max-w-md leading-tight">
            Editorial dispatches for a new generation of African creatives.
          </h3>
          <p className="mt-4 font-sans text-ink/60 max-w-md text-sm leading-relaxed">
            PhysioVibes is the independent voice of UBEPSA — covering culture, campus, and the conversations that shape tomorrow.
          </p>
        </div>
        <div>
          <h4 className="kicker text-gold mb-4">Sections</h4>
          <ul className="space-y-2 text-sm text-ink/70">
            <li><Link to="/articles" className="ink-link">Magazine</Link></li>
            <li><Link to="/gallery" className="ink-link">Gallery</Link></li>
            <li><Link to="/press" className="ink-link">Press</Link></li>
            <li><Link to="/about" className="ink-link">About & Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="kicker text-gold mb-4">Connect</h4>
          <ul className="space-y-2 text-sm text-ink/70 break-words">
            <li>@official_editorialpress</li>
            <li>ubepsaeditorial@gmail.com</li>
            <li>Department of Physiotherapy</li>
            <li>University of Benin, Benin City</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.6rem] sm:text-[0.65rem] tracking-[0.2em] uppercase text-ink/40">
          <span>© {new Date().getFullYear()} PhysioVibes / UBEPSA Editorial & Press</span>
          <span>Set in DM Serif Display & Inter</span>
        </div>
      </div>
    </footer>
  );
}
