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
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${scrolled || menuOpen ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm" : "bg-transparent"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3 sm:py-5">
            <Link 
              to="/" 
              onClick={() => setMenuOpen(false)} 
              className="flex items-center gap-2 sm:gap-3 group relative z-[60]"
            >
              <div className="relative h-8 w-8 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl overflow-hidden bg-white shadow-md border border-slate-100 p-1 transition-transform group-hover:scale-105">
                <img src="/logo.jfif" alt="UBEPSA Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg sm:text-xl font-black leading-none tracking-tighter uppercase text-ubepsa">
                  UBEPSA
                </span>
                <span className="text-[7px] sm:text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-0.5">UNIBEN Chapter</span>
              </div>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(n => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "bg-ubepsa text-white shadow-md shadow-blue-200" } as never}
                  className="px-3 py-1.5 rounded-lg text-[13px] font-bold text-slate-600 hover:text-ubepsa transition-all hover:bg-slate-50"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <Link to="/admin" className="text-slate-400 hover:text-ubepsa text-[11px] font-black uppercase tracking-widest transition-colors">Staff</Link>
              <Link to="/articles" className="btn-modern bg-ubepsa text-white px-5 py-2 hover:bg-ubepsa-dark shadow-lg shadow-blue-500/20 active:scale-95 text-[12px]">
                Portal
              </Link>
            </div>

            {/* Mobile burger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden relative z-[60] w-9 h-9 flex flex-col items-center justify-center gap-1.5 text-ubepsa bg-white rounded-lg shadow-md border border-slate-100 active:scale-95 transition-transform"
            >
              <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${menuOpen ? "translate-y-[6px] rotate-45 w-5" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-4 bg-current transition-all duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45 w-5" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-500 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Animated backdrop panels - sliding from right */}
        <div 
          className={`absolute inset-y-0 right-0 w-full xs:w-[280px] bg-white transition-transform duration-500 ease-in-out shadow-2xl z-50 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`} 
        />
        <div 
          className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />
        
        <nav className={`relative z-[60] h-full ml-auto w-full xs:w-[280px] flex flex-col justify-between px-5 pt-20 pb-8 transition-transform duration-500 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="flex-1 flex flex-col justify-center">
            <ul className="space-y-3">
              {[...NAV, { label: "Staff Portal", to: "/admin" }].map((n, i) => (
                <li
                  key={n.to}
                  className={`transition-all duration-500 delay-[${i * 50}ms] ${
                    menuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                  }`}
                >
                  <Link
                    to={n.to}
                    onClick={() => setMenuOpen(false)}
                    activeOptions={{ exact: n.to === "/" }}
                    activeProps={{ className: "text-ubepsa border-l-4 border-ubepsa pl-3" } as never}
                    className="font-display text-3xl font-black text-slate-900 block py-1.5 transition-all active:scale-95"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`mt-auto border-t border-slate-100 pt-6 transition-all duration-500 delay-500 ${menuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1.5">Connect With Us</p>
                  <div className="flex gap-3">
                    <a href="#" className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 font-bold hover:bg-ubepsa hover:text-white transition-all shadow-sm text-xs">IG</a>
                    <a href="#" className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 font-bold hover:bg-ubepsa hover:text-white transition-all shadow-sm text-xs">TW</a>
                  </div>
                </div>
                <img src="/logo.jfif" alt="" className="h-10 w-10 object-contain opacity-20" />
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
