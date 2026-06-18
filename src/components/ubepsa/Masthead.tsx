import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const NAV: { label: string; to: string }[] = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/event" },
  { label: "Excos", to: "/excos" },
  { label: "Scholarship", to: "/scholarship" },
  { label: "Gallery", to: "/gallery" },
  { label: "Articles", to: "/articles" },
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
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className={`mx-auto transition-all duration-500 ${scrolled ? "max-w-6xl px-4 mt-4" : "max-w-7xl px-4 mt-0"}`}>
          <div
            className={`flex items-center justify-between transition-all duration-500 px-6 ${
              scrolled
                ? "rounded-2xl border border-white/20 bg-white/80 backdrop-blur-xl py-3 shadow-lg shadow-blue-900/5"
                : "py-8 bg-transparent"
            }`}
          >
            <Link to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 group">
              <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-white shadow-md transition-transform group-hover:scale-105 border border-slate-100 p-1">
                <img src="/logo.jfif" alt="UBEPSA Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className={`font-display text-2xl font-black leading-none tracking-tighter uppercase transition-colors ${scrolled ? "text-ubepsa" : "text-ubepsa"}`}>
                  UBEPSA
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">UNIBEN Chapter</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "bg-ubepsa text-white shadow-md shadow-blue-200 scale-105" } as never}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-600 hover:text-ubepsa transition-all hover:bg-slate-50"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link to="/admin" className="text-slate-400 hover:text-ubepsa text-xs font-bold uppercase tracking-widest transition-colors">Staff</Link>
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="lg:hidden relative w-12 h-12 flex flex-col items-center justify-center gap-1.5 text-ubepsa bg-white rounded-xl shadow-md border border-slate-100"
            >
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-500 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-white/98 backdrop-blur-3xl" onClick={() => setMenuOpen(false)} />
        <nav className="relative h-full flex flex-col px-8 pt-24 pb-12">
          <div className="flex items-center gap-4 mb-16">
             <img src="/logo.jfif" alt="UBEPSA Logo" className="h-16 w-16 object-contain rounded-2xl shadow-xl bg-white p-2 border border-slate-50" />
             <div>
                <span className="font-display text-4xl font-black text-ubepsa block leading-none uppercase">UBEPSA</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Physiotherapy Students</span>
             </div>
          </div>
          <ul className="space-y-6">
            {[...NAV, { label: "Staff Portal", to: "/admin" }].map((n, i) => (
              <li
                key={n.to}
                className={`transition-all duration-500 ${menuOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                <Link
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-ubepsa scale-110" } as never}
                  className="font-display text-4xl font-bold text-slate-900 flex items-center justify-between group transition-transform"
                >
                  {n.label}
                  <span className="h-3 w-3 rounded-full bg-ubepsa opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-auto pt-12 border-t border-slate-100">
             <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Connect with us</p>
             <div className="flex gap-4">
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 font-bold hover:bg-ubepsa hover:text-white transition-all cursor-pointer shadow-sm">IG</div>
                <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 font-bold hover:bg-ubepsa hover:text-white transition-all cursor-pointer shadow-sm">TW</div>
             </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-8 py-24 grid gap-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <Link to="/" className="flex items-center gap-5 mb-10 group">
            <img src="/logo.jfif" alt="UBEPSA Logo" className="h-20 w-20 object-contain rounded-3xl shadow-xl bg-white p-2 transition-transform group-hover:scale-105" />
            <span className="font-display text-5xl font-black text-ubepsa uppercase tracking-tighter">
              UBEPSA
            </span>
          </Link>
          <h3 className="text-3xl font-bold text-slate-900 leading-tight mb-8 max-w-sm">
            Fostering Academic & Professional Growth.
          </h3>
          <p className="text-slate-600 leading-relaxed max-w-md text-lg">
            The University of Benin Physiotherapy Students' Association is dedicated to building a vibrant community of future health professionals.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-black text-ubepsa uppercase tracking-[0.2em] mb-10">Navigation</h4>
          <ul className="space-y-6 text-base font-bold text-slate-600">
            {NAV.slice(0, 4).map(n => (
               <li key={n.to}><Link to={n.to} className="hover:text-ubepsa transition-colors flex items-center gap-2 group"><span className="h-1 w-0 bg-ubepsa group-hover:w-4 transition-all rounded-full" /> {n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-black text-ubepsa uppercase tracking-[0.2em] mb-10">Resources</h4>
          <ul className="space-y-6 text-base font-bold text-slate-600">
            {NAV.slice(4).map(n => (
               <li key={n.to}><Link to={n.to} className="hover:text-ubepsa transition-colors flex items-center gap-2 group"><span className="h-1 w-0 bg-ubepsa group-hover:w-4 transition-all rounded-full" /> {n.label}</Link></li>
            ))}
            <li><Link to="/admin" className="hover:text-ubepsa transition-colors flex items-center gap-2 group"><span className="h-1 w-0 bg-ubepsa group-hover:w-4 transition-all rounded-full" /> Staff Login</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-black text-slate-400 uppercase tracking-[0.3em]">
          <span>© {new Date().getFullYear()} UBEPSA · UNIBEN Chapter</span>
          <div className="flex gap-10">
            <a href="#" className="hover:text-ubepsa transition-colors">Instagram</a>
            <a href="#" className="hover:text-ubepsa transition-colors">Twitter</a>
            <a href="#" className="hover:text-ubepsa transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
