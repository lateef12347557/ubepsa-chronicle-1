import { Link } from "@tanstack/react-router";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";

const NAV: { label: string; to: string }[] = [
  { label: "Front Page", to: "/" },
  { label: "Articles", to: "/articles" },
  { label: "Gallery", to: "/gallery" },
  { label: "Press Releases", to: "/press" },
  { label: "About & Contact", to: "/about" },
  { label: "Admin", to: "/admin" },
];

export function Masthead() {
  const { breaking } = useUbepsa();
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const ticker = breaking.map((b) => b.text);
  return (
    <header className="border-b-2 border-ink">
      {/* Ticker */}
      {ticker.length > 0 && (
        <div className="bg-ink text-cream overflow-hidden">
          <div className="flex items-center">
            <span className="font-mono text-[0.65rem] tracking-[0.2em] font-bold bg-press-red px-3 py-1.5 shrink-0">BREAKING</span>
            <div className="overflow-hidden flex-1">
              <div className="ticker-track py-1.5 text-sm font-serif">
                {[...ticker, ...ticker].map((t, i) => (
                  <span key={i} className="px-8 inline-flex items-center gap-3">
                    <span className="text-gold">◆</span>{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date / edition strip */}
      <div className="border-b border-cream/15 surface-ink">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 kicker text-cream/70">
          <span>{today} · Benin City</span>
          <span className="hidden sm:inline text-gold">Department of Physiotherapy · UNIBEN</span>
          <span>Issue · Vol. I</span>
        </div>
      </div>

      {/* Nameplate */}
      <div className="newsprint relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 halftone hidden md:block opacity-40 rotate-12" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-6">
          <div className="rule-double py-6">
            <Link to="/" className="block group">
              <div className="flex items-baseline gap-3 kicker text-press-red mb-3">
                <span className="inline-block w-8 h-px bg-press-red" />
                <span>UBEPSA · Editorial &amp; Press</span>
              </div>
              <h1 className="mega-display text-[2.6rem] sm:text-7xl lg:text-[7.5rem] text-ink">
                Physio<span className="text-press-red">Vibes</span>
              </h1>
              <p className="mt-4 font-serif italic text-ink/75 text-base sm:text-xl max-w-2xl">
                The bold voice of physiotherapy students at the University of Benin — stories, photography, and dispatches from the department.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="surface-ink border-y border-cream/10">
        <div className="max-w-7xl mx-auto px-2">
          <ul className="flex flex-wrap items-center justify-center">
            {NAV.map(n => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ "data-active": "true", className: "text-gold" } as never}
                  className="nav-link block kicker text-cream/85 px-4 py-3.5 hover:text-gold transition-colors"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-ink text-cream">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl font-black">UBEPSA Editorial &amp; Press</div>
          <p className="mt-2 font-serif text-cream/80 max-w-md">
            The official media and communications arm of the University of Benin Physiotherapy Students' Association — informing, inspiring, and amplifying the voice of physiotherapy students.
          </p>
          <p className="mt-4 font-mono text-xs tracking-[0.18em] uppercase text-gold">A free press is a free people</p>
        </div>
        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-3">Sections</h4>
          <ul className="space-y-1.5 text-sm">
            <li><Link to="/articles" className="ink-link">Articles</Link></li>
            <li><Link to="/gallery" className="ink-link">Gallery</Link></li>
            <li><Link to="/press" className="ink-link">Press Releases</Link></li>
            <li><Link to="/about" className="ink-link">About & Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs tracking-[0.2em] uppercase text-gold mb-3">Connect</h4>
          <ul className="space-y-1.5 text-sm">
            <li>@official_editorialpress</li>
            <li>ubepsaeditorial@gmail.com</li>
            <li>Department of Physiotherapy</li>
            <li>University of Benin, Benin City</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-cream/60">
          <span>© {new Date().getFullYear()} UBEPSA Editorial &amp; Press. All rights reserved.</span>
          <span>Set in Playfair Display, Source Serif 4 & IBM Plex Mono</span>
        </div>
      </div>
    </footer>
  );
}
