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
  const [hero, ...rest] = articles;
  const latest = rest.slice(0, 6);
  const trendingTags = Array.from(new Set(articles.flatMap(a => a.tags))).slice(0, 8);

  return (
    <div className="page-fade">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 pt-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <article className="lg:col-span-2 cursor-pointer group" onClick={() => setOpen(hero)}>
            <div className="relative overflow-hidden">
              <img src={hero.cover} alt={hero.title} className="w-full h-[26rem] sm:h-[34rem] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-cream">
                <span className="stamp text-gold border-gold">Lead Story · {hero.category}</span>
                <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl leading-[1.05] mt-4 max-w-3xl group-hover:text-gold transition-colors">
                  {hero.title}
                </h2>
                <p className="mt-4 font-serif text-base sm:text-lg max-w-2xl text-cream/85">{hero.excerpt}</p>
                <div className="mt-5 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-cream/70">
                  By {hero.author} · {hero.date} · {hero.readTime} min read
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-8">
            <div className="bg-card p-6 border-t-4 border-press-red">
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-press-red font-bold">Recent Press Releases</h3>
              <ul className="mt-4 divide-y divide-ink/10">
                {releases.slice(0, 3).map(r => (
                  <li key={r.id} className="py-3">
                    <p className="font-display font-bold text-base leading-snug text-ink">{r.title}</p>
                    <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ink/60 mt-1">{r.date}</p>
                  </li>
                ))}
              </ul>
              <Link to="/press" className="mt-4 inline-block font-mono text-xs tracking-[0.18em] uppercase text-press-red ink-link">All Releases →</Link>
            </div>

            <div className="bg-ink text-cream p-6">
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold">Trending Tags</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {trendingTags.map(t => (
                  <span key={t} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase px-2.5 py-1 border border-cream/30 hover:border-gold hover:text-gold transition-colors cursor-default">#{t}</span>
                ))}
              </div>
            </div>

            <div className="bg-card p-6 border border-ink/15">
              <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-ink/70 font-bold">About UBEPSA</h3>
              <p className="mt-3 font-serif text-sm text-ink/80 leading-relaxed">
                Since 1979, UBEPSA has been the independent voice of the University of Benin — the first draft of UNIBEN's history, written by its students.
              </p>
              <Link to="/about" className="mt-3 inline-block font-mono text-xs tracking-[0.18em] uppercase text-press-red ink-link">Read more →</Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Latest grid */}
      <section className="max-w-7xl mx-auto px-4 mt-16">
        <div className="rule-double py-3 mb-8 flex items-end justify-between">
          <h2 className="font-display font-black text-3xl">Latest Dispatches</h2>
          <Link to="/articles" className="font-mono text-xs tracking-[0.2em] uppercase text-press-red ink-link">View all →</Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {latest.map(a => <ArticleCard key={a.id} article={a} onOpen={setOpen} />)}
        </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}
