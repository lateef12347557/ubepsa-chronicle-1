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
      const okQ = !q || (a.title + " " + (a.excerpt || "") + " " + a.tags.join(" ")).toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [articles, cat, q]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-bold text-blue-900">Articles & News</h1>
        <p className="text-slate-600 mt-2">The latest stories, reports, and updates from UBEPSA.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12">
        <div className="relative w-full md:max-w-md">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search stories..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {["All", ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${cat === c ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600"}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-slate-400 text-lg">No articles found matching your criteria.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.slice(0, visible).map(a => <ArticleCard key={a.id} article={a} onOpen={setOpen} />)}
          </div>
          {visible < filtered.length && (
            <div className="text-center mt-16">
              <button 
                onClick={() => setVisible(v => v + 6)} 
                className="bg-white text-blue-600 border border-blue-200 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors shadow-sm"
              >
                Load More Articles
              </button>
            </div>
          )}
        </>
      )}

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}

