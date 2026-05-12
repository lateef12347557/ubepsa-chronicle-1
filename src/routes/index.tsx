import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { ArticleCard } from "@/components/ubepsa/ArticleCard";
import { ArticleModal } from "@/components/ubepsa/ArticleModal";
import type { Article } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { articles, releases } = useUbepsa();
  const [open, setOpen] = useState<Article | null>(null);
  const [hero, second, third, ...rest] = articles;
  const latest = rest.slice(0, 6);
  const trendingTags = Array.from(new Set(articles.flatMap(a => a.tags))).slice(0, 8);

  if (!hero) {
    return (
      <div className="page-fade max-w-7xl mx-auto px-4 py-32 text-center">
        <p className="kicker text-ink/50">Loading dispatches…</p>
      </div>
    );
  }

  return (
    <div className="page-fade">
      {/* Hero — asymmetric magazine cover */}
      <section className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Lead story — oversized */}
          <article
            className="lg:col-span-8 cursor-pointer group rise-in"
            onClick={() => setOpen(hero)}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="stamp stamp-solid">Lead Story</span>
              <span className="kicker text-ink/60">{hero.category}</span>
              <span className="ml-auto kicker text-ink/40 hidden sm:inline">{hero.readTime} min read</span>
            </div>
            <div className="img-frame">
              <img
                src={hero.cover}
                alt={hero.title}
                className="w-full h-[22rem] sm:h-[32rem] lg:h-[36rem] object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 z-10 text-cream">
                <h2 className="mega-display text-3xl sm:text-5xl lg:text-7xl max-w-4xl group-hover:text-gold transition-colors duration-500">
                  {hero.title}
                </h2>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-[1fr_auto] gap-6 items-start">
              <p className="font-serif text-lg sm:text-xl text-ink/85 leading-snug max-w-2xl">
                {hero.excerpt}
              </p>
              <div className="kicker text-ink/60 sm:text-right whitespace-nowrap">
                By {hero.author}<br />
                <span className="text-press-red">{hero.date}</span>
              </div>
            </div>
          </article>

          {/* Sidebar — stacked dispatches */}
          <aside className="lg:col-span-4 space-y-6 rise-in" style={{ animationDelay: "120ms" }}>
            {[second, third].filter(Boolean).map((a, i) => (
              <article
                key={a!.id}
                onClick={() => setOpen(a!)}
                className="card-bold cursor-pointer p-5 border border-ink/10 group"
              >
                <div className="flex items-start gap-4">
                  <span className="numeral shrink-0">{String(i + 2).padStart(2, "0")}</span>
                  <div className="flex-1 min-w-0">
                    <span className="kicker text-press-red">{a!.category}</span>
                    <h3 className="font-display font-black text-xl leading-tight mt-2 text-ink group-hover:text-press-red transition-colors">
                      {a!.title}
                    </h3>
                    <p className="kicker text-ink/50 mt-3">{a!.author} · {a!.date}</p>
                  </div>
                </div>
              </article>
            ))}

            <div className="surface-ink p-6 relative overflow-hidden">
              <div className="absolute -bottom-8 -right-8 w-40 h-40 halftone opacity-30" aria-hidden />
              <h3 className="kicker text-gold">Press Releases</h3>
              <ul className="mt-4 divide-y divide-cream/15">
                {releases.slice(0, 3).map(r => (
                  <li key={r.id} className="py-3">
                    <p className="font-display font-bold text-base leading-snug text-cream">{r.title}</p>
                    <p className="kicker text-cream/50 mt-1">{r.date}</p>
                  </li>
                ))}
              </ul>
              <Link to="/press" className="mt-5 inline-block kicker text-gold ink-link">All releases →</Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Trending tags band */}
      {trendingTags.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-20">
          <div className="rule-thick pt-5 flex flex-wrap items-center gap-3">
            <span className="kicker text-press-red">Now trending</span>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map(t => (
                <span key={t} className="kicker px-3 py-1.5 border border-ink/20 hover:border-press-red hover:text-press-red transition-colors cursor-default">
                  #{t}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest grid */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="rule-double py-4 mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="kicker text-press-red">The desk</span>
            <h2 className="mega-display text-4xl sm:text-6xl mt-2">Latest Dispatches</h2>
          </div>
          <Link to="/articles" className="kicker text-press-red ink-link shrink-0 pb-2">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {latest.map((a, i) => (
            <div key={a.id} className="rise-in" style={{ animationDelay: `${i * 60}ms` }}>
              <ArticleCard article={a} onOpen={setOpen} />
            </div>
          ))}
        </div>
      </section>

      {/* Closing manifesto band */}
      <section className="max-w-7xl mx-auto px-4 mt-24 mb-10">
        <div className="surface-ink p-8 sm:p-14 grid md:grid-cols-[1fr_auto] gap-8 items-end">
          <div>
            <span className="kicker text-gold">The manifesto</span>
            <p className="font-display italic text-2xl sm:text-4xl leading-tight text-cream mt-3 max-w-3xl">
              "Keep the voice of physiotherapy students alive — through storytelling, media coverage, and creative expression that inform, educate, and unite."
            </p>
          </div>
          <Link to="/about" className="kicker text-gold ink-link whitespace-nowrap">About the desk →</Link>
        </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}
