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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <header className="mb-10 sm:mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
          The Newsroom
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">Latest <span className="text-ubepsa">Stories.</span></h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">The latest stories, reports, and professional updates from the UBEPSA community.</p>
      </header>

      <div className="flex flex-col gap-6 sm:gap-10 mb-12 sm:mb-16">
        <div className="relative w-full max-w-2xl group">
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search stories, topics, or tags..."
            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 sm:py-5 focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:bg-white focus:outline-none transition-all text-base sm:text-lg font-medium placeholder:text-slate-400 group-hover:border-slate-200"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-hover:text-ubepsa transition-colors hidden sm:block">
             🔍
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {["All", ...CATEGORIES].map(c => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 ${
                cat === c 
                  ? "bg-ubepsa text-white shadow-xl shadow-blue-500/20" 
                  : "bg-white text-slate-500 border-2 border-slate-100 hover:border-ubepsa hover:text-ubepsa hover:bg-slate-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 sm:py-32 text-center border-2 border-dashed border-slate-100 rounded-3xl sm:rounded-[3rem] bg-slate-50">
          <p className="text-slate-400 font-black text-xl sm:text-2xl mb-2">No stories found.</p>
          <p className="text-slate-400 font-medium">Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {filtered.slice(0, visible).map(a => (
              <div key={a.id} className="reveal in">
                <ArticleCard article={a} onOpen={setOpen} />
              </div>
            ))}
          </div>
          
          {visible < filtered.length && (
            <div className="text-center mt-16 sm:mt-24">
              <button 
                onClick={() => setVisible(v => v + 6)} 
                className="bg-white text-slate-900 border-2 border-slate-100 px-8 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:border-ubepsa hover:text-ubepsa transition-all shadow-sm hover:shadow-lg active:scale-95"
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
