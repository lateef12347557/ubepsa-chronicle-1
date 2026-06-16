import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { ArticleCard } from "@/components/ubepsa/ArticleCard";
import { ArticleModal } from "@/components/ubepsa/ArticleModal";
import type { Article } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { articles, releases, breaking } = useUbepsa();
  const [open, setOpen] = useState<Article | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [hero, second, third, ...rest] = articles;
  const bentoSide = [second, third].filter(Boolean) as Article[];
  const feed = rest.slice(0, 6);

  if (!hero) {
    return (
      <div className="page-fade max-w-7xl mx-auto px-4 py-40 text-center">
        <span className="kicker">Loading…</span>
      </div>
    );
  }

  return (
    <div className="page-fade">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* ambient orbs */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="orb orb-a float-slow" style={{ width: 520, height: 520, top: -120, left: -120 }} />
          <div className="orb orb-b float-slow" style={{ width: 420, height: 420, top: 80, right: -100, animationDelay: "-6s" }} />
          <div className="orb orb-c" style={{ width: 600, height: 600, bottom: -260, left: "30%" }} />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-20">
          <div className="flex items-center gap-3 mb-8 reveal flex-wrap">
            <span className="stamp stamp-dot">Issue 001 · Out now</span>
            <span className="hidden sm:inline kicker">UBEPSA Editorial & Press · UNIBEN</span>
          </div>

          <h1 className="mega-display text-[2.5rem] xs:text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] max-w-5xl text-ink reveal">
            Stories from the <br className="hidden sm:block" />
            <span className="italic text-gradient underline-sketch">physio</span> desk.
          </h1>

          <div className="mt-10 sm:mt-14 grid md:grid-cols-[1fr_auto] gap-6 sm:gap-10 items-end reveal">
            <p className="text-base sm:text-lg text-ink/70 max-w-xl leading-relaxed">
              We're the editorial board of UBEPSA — physiotherapy students at the University of Benin who'd rather write than scroll.
              Features, interviews, opinion pieces, and the occasional dispatch from clinical postings. All of it made on campus, by hand.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/articles" className="btn-primary">Read the issue →</Link>
              <Link to="/about" className="btn-ghost">Who we are</Link>
            </div>
          </div>
        </div>

        {/* breaking ticker — minimal */}
        {breaking.length > 0 && (
          <div className="border-y border-white/5 bg-white/[0.015] overflow-hidden">
            <div className="flex items-center">
              <span className="font-mono text-[0.6rem] tracking-[0.25em] font-medium bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-2 shrink-0">LIVE</span>
              <div className="overflow-hidden flex-1">
                <div className="ticker-track py-2 text-[0.72rem] font-mono tracking-wider">
                  {[...breaking, ...breaking].map((b, i) => (
                    <span key={i} className="px-6 inline-flex items-center gap-3 text-ink/70">
                      <span className="text-indigo-400">◆</span>{b.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ============ FEATURED BENTO ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-24 reveal">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <span className="kicker">This week's lead</span>
            <h2 className="font-display text-3xl sm:text-4xl mt-2 text-ink">The one we kept arguing about in the group chat.</h2>
          </div>
          <Link to="/articles" className="kicker text-ink/70 ink-link shrink-0">All stories →</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 lg:[grid-template-rows:repeat(2,minmax(0,1fr))] lg:h-[42rem]">
          {/* Big hero tile */}
          <article
            onClick={() => setOpen(hero)}
            className="bento lg:col-span-2 lg:row-span-2 group cursor-pointer relative overflow-hidden min-h-[24rem]"
          >
            <img src={hero.cover} alt={hero.title} className="absolute inset-0 w-full h-full object-cover hero-zoom opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#050510] via-[#050510]/60 to-transparent" />
            <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between">
              <span className="stamp stamp-dot self-start">{hero.category}</span>
              <div>
                <h3 className="mega-display text-3xl sm:text-5xl lg:text-6xl text-ink max-w-2xl">
                  {hero.title}
                </h3>
                <div className="mt-5 flex flex-wrap items-center gap-4 kicker">
                  <span className="text-ink/80">By {hero.author}</span>
                  <span className="text-ink/40">·</span>
                  <span className="text-ink/60">{hero.date}</span>
                  <span className="text-ink/40">·</span>
                  <span className="text-ink/60">{hero.readTime} min</span>
                </div>
              </div>
            </div>
          </article>

          {/* Side tiles */}
          {bentoSide.map((a) => (
            <ArticleCard key={a.id} article={a} onOpen={setOpen} size="sm" />
          ))}

          {/* Fallback if not enough — stat tile */}
          {bentoSide.length < 2 && (
            <div className="bento p-6 sm:p-8 flex flex-col justify-between min-h-[14rem]">
              <span className="kicker">By the numbers</span>
              <div>
                <p className="font-display text-5xl sm:text-6xl text-gradient">001</p>
                <p className="mt-2 text-sm text-ink/55">The Voice Issue · Now live</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ============ STATS STRIP ============ */}
      <section className="max-w-7xl mx-auto px-4 mt-16 sm:mt-24 reveal">
        <div className="glass p-6 sm:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {[
            { k: "Stories published", v: articles.length || "—" },
            { k: "Contributors", v: new Set(articles.map(a => a.author)).size || "—" },
            { k: "Press releases", v: releases.length || "—" },
            { k: "Issue", v: "001" },
          ].map((s) => (
            <div key={s.k}>
              <p className="font-display text-3xl sm:text-5xl text-ink">{s.v}</p>
              <p className="mt-2 kicker">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ THE FEED — BENTO GRID ============ */}
      {feed.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20 sm:mt-28 reveal">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <span className="kicker">From the feed</span>
              <h2 className="mega-display text-4xl sm:text-6xl mt-3 text-ink">
                What we've been <span className="text-gradient italic underline-sketch">writing</span>.
              </h2>
            </div>
            <Link to="/articles" className="btn-ghost shrink-0">All stories →</Link>
          </div>

          {/* Bento grid: 6 cards w/ varying spans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 auto-rows-auto gap-4 sm:gap-5">
            {feed.map((a, i) => {
              const spans = [
                "lg:col-span-3",
                "lg:col-span-3",
                "lg:col-span-2",
                "lg:col-span-2",
                "lg:col-span-2",
                "lg:col-span-6",
              ];
              const sizes: ("sm" | "md" | "lg")[] = ["md", "md", "sm", "sm", "sm", "lg"];
              return (
                <div key={a.id} className={`${spans[i] ?? "lg:col-span-2"} reveal`} style={{ transitionDelay: `${i * 50}ms` }}>
                  <ArticleCard article={a} onOpen={setOpen} size={sizes[i] ?? "md"} />
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ PRESS RELEASES ============ */}
      {releases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20 sm:mt-28 reveal">
          <div className="glass relative overflow-hidden p-6 sm:p-12">
            <div className="absolute -top-20 -right-20 w-80 h-80 orb orb-a opacity-40" />
            <div className="relative grid lg:grid-cols-[1fr_2fr] gap-10">
              <div>
                <span className="kicker">From the desk</span>
                <h2 className="mega-display text-3xl sm:text-5xl mt-3 text-ink">
                  Press <span className="text-gradient italic">releases</span>.
                </h2>
                <p className="mt-4 text-sm text-ink/55 max-w-sm leading-relaxed">
                  Official announcements from the editorial board, straight to you.
                </p>
                <Link to="/press" className="mt-6 inline-block kicker text-ink ink-link">All releases →</Link>
              </div>
              <ul className="divide-y divide-white/5">
                {releases.slice(0, 5).map(r => (
                  <li key={r.id} className="py-4 sm:py-5 grid sm:grid-cols-[1fr_auto] gap-2 sm:gap-6">
                    <p className="font-display text-lg sm:text-xl text-ink leading-tight">{r.title}</p>
                    <p className="kicker sm:text-right shrink-0">{r.date}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ============ NEWSLETTER ============ */}
      <section className="mt-20 sm:mt-28 reveal">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="stamp stamp-dot">The dispatch</span>
          <h2 className="mega-display text-4xl sm:text-6xl lg:text-7xl mt-6 text-ink">
            Get the issue<br />
            <span className="text-gradient italic">before it prints.</span>
          </h2>
          <p className="mt-5 text-ink/55 max-w-lg mx-auto">
            One curated letter, every other Sunday. Stories, photography, and dispatches from the editor's desk.
          </p>

          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }}
            className="mt-10 max-w-xl mx-auto glass p-1.5 flex items-stretch gap-1.5 rounded-full"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 min-w-0 bg-transparent text-ink text-sm sm:text-base font-sans py-3 px-5 focus:outline-none placeholder:text-ink/30"
            />
            <button type="submit" className="btn-primary !rounded-full shrink-0 !py-3 !px-5">
              {submitted ? "Subscribed ✓" : "Subscribe"}
            </button>
          </form>
          <p className="mt-4 kicker text-ink/40">No spam · Unsubscribe anytime</p>
        </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}
