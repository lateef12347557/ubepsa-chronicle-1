import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { ArticleCard } from "@/components/ubepsa/ArticleCard";
import { ArticleModal } from "@/components/ubepsa/ArticleModal";
import { Typewriter } from "@/components/ubepsa/Typewriter";
import type { Article } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/")({ component: Index });

const TICKER_TAGS = [
  "Culture", "Campus", "Voices", "Photography", "Opinion", "Features",
  "Long-reads", "Press", "Dispatch", "New School", "Issue 001",
];

function Index() {
  const { articles, releases } = useUbepsa();
  const [open, setOpen] = useState<Article | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [hero, second, third, ...rest] = articles;
  const latest = rest.slice(0, 6);
  const picks = [second, third, rest[0]].filter(Boolean).slice(0, 3) as Article[];

  if (!hero) {
    return (
      <div className="page-fade max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="kicker text-ink/40">Loading dispatches…</p>
      </div>
    );
  }

  return (
    <div className="page-fade">
      {/* HERO ===================================== */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden grain">
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, rgba(26,107,255,0.35), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,179,71,0.18), transparent 55%)`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(240,237,230,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(240,237,230,0.04)_1px,transparent_1px)] bg-[size:80px_80px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 w-full py-20 sm:py-32">
          <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            <span className="h-px w-8 sm:w-12 bg-press-red" />
            <span className="kicker text-press-red text-[0.6rem] sm:text-[0.68rem]">Issue 001 · The Voice Issue</span>
          </div>
          <h1 className="mega-display text-[2.25rem] xs:text-[2.75rem] sm:text-[5rem] md:text-[6rem] lg:text-[9rem] max-w-6xl text-ink break-words">
            <Typewriter text="A new language for a new generation." />
          </h1>
          <div className="mt-10 sm:mt-12 grid md:grid-cols-[1fr_auto] gap-6 sm:gap-8 items-end">
            <p className="font-sans text-base sm:text-xl text-ink/65 max-w-2xl leading-relaxed">
              Dark, cinematic, unflinching — PhysioVibes is the editorial press for young creatives, tastemakers, and the storytellers shaping what comes next.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/articles" className="kicker text-ink ink-link">Read the issue →</Link>
              <Link to="/about" className="kicker text-ink/40 ink-link">Manifesto</Link>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 kicker text-ink/40">
          <span>Scroll</span>
          <span className="block w-px h-10 bg-ink/30" />
        </div>
      </section>

      {/* FEATURED STORY ===================================== */}
      <section className="max-w-[100rem] mx-auto px-4 mt-10 reveal">
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <span className="kicker text-press-red">Featured Story</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-ink/80">The cover.</h2>
          </div>
          <span className="kicker text-ink/40 hidden sm:inline">{hero.readTime} min read</span>
        </div>
        <article
          onClick={() => setOpen(hero)}
          className="group relative cursor-pointer overflow-hidden"
        >
          <div className="img-frame aspect-[16/10] sm:aspect-[21/10]">
            <img
              src={hero.cover}
              alt={hero.title}
              className="hero-zoom w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-16">
              <div className="overflow-hidden">
                <h2 className="mega-display text-3xl sm:text-6xl lg:text-8xl text-ink max-w-5xl translate-y-2 group-hover:-translate-y-2 transition-transform duration-[700ms] ease-out">
                  {hero.title}
                </h2>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-5 kicker text-ink/70">
                <span className="stamp stamp-solid">{hero.category}</span>
                <span>By {hero.author}</span>
                <span>·</span>
                <span>{hero.date}</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* TICKER ===================================== */}
      <section className="mt-24 border-y border-white/10 py-8 overflow-hidden">
        <div className="ticker-track text-[clamp(2rem,6vw,5rem)] font-display leading-none">
          {[...TICKER_TAGS, ...TICKER_TAGS].map((t, i) => (
            <span key={i} className="px-8 inline-flex items-center gap-8">
              <span className="text-ink/85">{t}</span>
              <span className="text-press-red text-3xl">✦</span>
            </span>
          ))}
        </div>
      </section>

      {/* LATEST ASYMMETRIC GRID ===================================== */}
      <section className="max-w-7xl mx-auto px-4 mt-24 reveal">
        <div className="flex items-end justify-between mb-10 border-b border-white/10 pb-6">
          <div>
            <span className="kicker text-press-red">The Feed</span>
            <h2 className="mega-display text-4xl sm:text-6xl mt-3 text-ink">Latest dispatches.</h2>
          </div>
          <Link to="/articles" className="kicker text-ink/80 ink-link shrink-0">All stories →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[minmax(0,auto)]">
          {latest.map((a, i) => {
            // Asymmetric masonry: vary span and offset
            const spans = [
              "md:col-span-4",
              "md:col-span-2 md:mt-12",
              "md:col-span-2",
              "md:col-span-4 md:-mt-8",
              "md:col-span-3",
              "md:col-span-3 md:mt-10",
            ];
            return (
              <div key={a.id} className={`${spans[i] ?? "md:col-span-3"} reveal`} style={{ transitionDelay: `${i * 60}ms` }}>
                <ArticleCard article={a} onOpen={setOpen} />
              </div>
            );
          })}
        </div>
      </section>

      {/* EDITORS' PICKS — flip cards ===================================== */}
      {picks.length === 3 && (
        <section className="max-w-7xl mx-auto px-4 mt-32 reveal">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="kicker text-gold">Editors' Picks</span>
              <h2 className="mega-display text-4xl sm:text-6xl mt-3 text-ink">Hand-picked, on the record.</h2>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {picks.map((a, i) => (
              <div key={a.id} className="flip-card h-[28rem] cursor-pointer" onClick={() => setOpen(a)}>
                <div className="flip-card-inner">
                  <div className="flip-face border border-white/10 overflow-hidden">
                    <img src={a.cover} alt={a.title} className="absolute inset-0 w-full h-full object-cover opacity-80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <span className="numeral text-press-red">{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <span className="stamp stamp-solid">{a.category}</span>
                        <h3 className="font-display text-3xl mt-3 text-ink leading-tight">{a.title}</h3>
                      </div>
                    </div>
                  </div>
                  <div className="flip-face flip-back surface-ink p-8 flex flex-col justify-between border border-press-red/40">
                    <div>
                      <span className="kicker text-press-red">Excerpt</span>
                      <p className="mt-5 font-display italic text-2xl leading-snug text-ink">
                        "{a.excerpt}"
                      </p>
                    </div>
                    <div className="flex items-center justify-between kicker text-ink/60">
                      <span>{a.author}</span>
                      <span className="text-gold">Read →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PRESS RELEASES strip ===================================== */}
      {releases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-32 reveal">
          <div className="surface-ink relative overflow-hidden grain p-8 sm:p-14 border border-white/10">
            <div className="absolute -bottom-12 -right-12 w-64 h-64 halftone opacity-50" aria-hidden />
            <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
              <div>
                <span className="kicker text-gold">From the desk</span>
                <h2 className="mega-display text-4xl sm:text-5xl mt-3 text-ink">Press releases.</h2>
                <Link to="/press" className="mt-6 inline-block kicker text-gold ink-link">All releases →</Link>
              </div>
              <ul className="divide-y divide-white/10">
                {releases.slice(0, 4).map(r => (
                  <li key={r.id} className="py-5 grid sm:grid-cols-[1fr_auto] gap-3">
                    <p className="font-display text-xl text-ink leading-tight">{r.title}</p>
                    <p className="kicker text-ink/40 sm:text-right">{r.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* NEWSLETTER ===================================== */}
      <section className="mt-32 reveal">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <span className="kicker text-press-red">The dispatch</span>
          <h2 className="mega-display text-5xl sm:text-7xl lg:text-8xl mt-6 text-ink">
            Get the issue<br />before it prints.
          </h2>
          <p className="mt-6 font-sans text-ink/55 max-w-xl mx-auto">
            One letter, every other Sunday. Stories, photography, and dispatches — straight from the editor's desk.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
            className="mt-12 max-w-2xl mx-auto flex items-stretch border-b border-ink/30 focus-within:border-press-red transition-colors"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-transparent text-ink text-2xl sm:text-3xl font-display py-5 px-2 focus:outline-none placeholder:text-ink/30"
            />
            <button
              type="submit"
              className="btn-morph kicker text-ink bg-press-red px-8 hover:px-12 transition-all"
            >
              <span>{submitted ? "Subscribed ✓" : "Subscribe →"}</span>
            </button>
          </form>
        </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}
