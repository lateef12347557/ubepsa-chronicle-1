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

const FALLBACK_TICKER = [
  "BREAKING — Senate ratifies 2026 curriculum overhaul",
  "PIRATES win EUI Cup for third consecutive year",
  "UBEPSA calls for open audit of hostel allocations",
  "Submissions OPEN for the 2026 UBEPSA Annual Magazine — deadline 30 June",
  "John Harris Library opening hours under review",
  "Convocation 2026 photo essay now LIVE in Gallery",
];

export function Masthead() {
  const { breaking } = useUbepsa();
  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const ticker = breaking.length ? breaking.map((b) => b.text) : FALLBACK_TICKER;
  return (
    <header className="border-b-2 border-ink">
      {/* Ticker */}
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

      {/* Date / edition strip */}
      <div className="border-b border-ink/30 newsprint">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.7rem] tracking-[0.15em] uppercase text-ink/70">
          <span>{today} · Benin City, Nigeria</span>
          <span>Vol. XLI · No. 18 · Established 1979</span>
          <span>Price: Complimentary</span>
        </div>
      </div>

      {/* Nameplate */}
      <div className="newsprint">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 text-center">
          <div className="rule-double py-4">
            <Link to="/" className="block">
              <h1 className="font-display font-black text-5xl sm:text-7xl lg:text-8xl leading-none text-ink tracking-tight">
                UBEPSA
              </h1>
              <p className="mt-3 font-serif italic text-ink/80 text-base sm:text-lg">
                The Voice of UNIBEN Press · University of Benin Press & Students' Association
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0">
            {NAV.map(n => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-gold border-gold" }}
                  className="block font-mono text-[0.7rem] tracking-[0.2em] uppercase font-semibold px-4 py-3 border-b-2 border-transparent hover:text-gold hover:border-gold/60 transition-colors"
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
          <div className="font-display text-3xl font-black">UBEPSA</div>
          <p className="mt-2 font-serif text-cream/80 max-w-md">
            The University of Benin Press & Students' Association — chronicling life at UNIBEN since 1979.
            Independent, student-led, and accountable to the truth.
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
            <li>@ubepsa_uniben</li>
            <li>press@ubepsa.uniben.edu</li>
            <li>UNIBEN, Ugbowo Campus</li>
            <li>Benin City, Edo State</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-2 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-cream/60">
          <span>© {new Date().getFullYear()} UBEPSA. All rights reserved.</span>
          <span>Set in Playfair Display, Source Serif 4 & IBM Plex Mono</span>
        </div>
      </div>
    </footer>
  );
}
