import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { ArticleCard } from "@/components/ubepsa/ArticleCard";
import { ArticleModal } from "@/components/ubepsa/ArticleModal";
import { CATEGORIES, type Article } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/articles")({ component: ArticlesPage });

function ArticlesPage() {
  const { articles } = useUbepsa();
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [visible, setVisible] = useState(9);
  const [open, setOpen] = useState<Article | null>(null);

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const okCat = cat === "All" || a.category === cat;
      const okQ = !q || (a.title + " " + a.excerpt + " " + a.tags.join(" ")).toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [articles, cat, q]);

  return (
    <div className="page-fade max-w-7xl mx-auto px-4 py-12">
      <div className="rule-double py-3 mb-8">
        <h1 className="font-display font-black text-4xl sm:text-5xl">Articles</h1>
        <p className="font-serif italic text-ink/70 mt-1">Reportage, opinion, features & photo essays from the UBEPSA Editorial & Press desk.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-3 md:items-center justify-between mb-6">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search articles by title, keyword, or tag…"
          className="bg-card border border-ink/30 px-4 py-2.5 font-serif text-sm w-full md:max-w-md focus:outline-none focus:border-press-red"
        />
        <div className="flex flex-wrap gap-1.5">
          {["All", ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase px-3 py-1.5 border transition-colors ${cat === c ? "bg-ink text-cream border-ink" : "border-ink/30 text-ink/70 hover:border-press-red hover:text-press-red"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-serif italic text-ink/60 py-20 text-center">No articles match your search.</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, visible).map(a => <ArticleCard key={a.id} article={a} onOpen={setOpen} />)}
          </div>
          {visible < filtered.length && (
            <div className="text-center mt-10">
              <button onClick={() => setVisible(v => v + 6)} className="font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-6 py-3 hover:bg-press-red transition-colors">
                Load More
              </button>
            </div>
          )}
        </>
      )}

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}
