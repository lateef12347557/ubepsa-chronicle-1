import type { Article } from "@/lib/ubepsa-store";
import { useEffect } from "react";

export function ArticleModal({ article, onClose }: { article: Article | null; onClose: () => void }) {
  useEffect(() => {
    if (!article) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [article, onClose]);

  if (!article) return null;
  const paragraphs = article.body.split("\n").filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="min-h-full py-12 px-4 flex items-start justify-center">
        <article
          className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video">
            <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 bg-white/90 text-blue-900 px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
            >
              ✕ Close
            </button>
          </div>
          <div className="p-8 sm:p-16">
            <div className="mb-10">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">{article.category}</span>
              <h1 className="text-3xl sm:text-5xl font-bold text-blue-900 mt-6 leading-tight">{article.title}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8 text-sm font-medium text-slate-500 border-b border-slate-100 pb-8">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
                    {article.author[0]}
                  </div>
                  <span className="text-blue-900 font-bold">{article.author}</span>
                </div>
                <span>{article.date}</span>
                <span>{article.readTime} min read</span>
              </div>
            </div>
            
            <div className="font-sans text-lg leading-relaxed text-slate-700 space-y-8 max-w-2xl">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            
            <div className="mt-16 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
              {article.tags.map(t => (
                <span key={t} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-bold tracking-wide">#{t}</span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

