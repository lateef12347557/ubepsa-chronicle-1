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
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="min-h-full py-4 sm:py-12 px-4 flex items-start justify-center">
        <article
          className="bg-white max-w-4xl w-full rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video sm:aspect-[21/9]">
            <img src={article.cover} alt={article.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/95 text-ubepsa px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl font-black shadow-xl hover:bg-ubepsa hover:text-white transition-all active:scale-95 text-xs sm:text-base"
            >
              ✕ Close
            </button>
          </div>
          
          <div className="p-6 sm:p-16 lg:p-20">
            <div className="mb-8 sm:mb-12">
              <span className="bg-blue-50 text-ubepsa px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">{article.category}</span>
              <h1 className="text-2xl sm:text-5xl font-black text-slate-900 mt-4 sm:mt-6 leading-tight tracking-tighter">{article.title}</h1>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-6 sm:mt-10 text-sm font-bold text-slate-400 border-b border-slate-100 pb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-ubepsa font-black">
                    {article.author[0]}
                  </div>
                  <div>
                     <p className="text-slate-900 font-black leading-none">{article.author}</p>
                     <p className="text-[10px] uppercase tracking-widest mt-1">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-2 sm:pl-0 border-l sm:border-none border-slate-100">
                  <span className="text-slate-900">{article.date}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-200" />
                  <span className="text-ubepsa font-black">{article.readTime} min read</span>
                </div>
              </div>
            </div>
            
            <div className="font-sans text-base sm:text-xl leading-relaxed text-slate-600 space-y-6 sm:space-y-10 max-w-3xl">
              {paragraphs.map((p, i) => (
                <p key={i} className="first-letter:text-3xl first-letter:font-black first-letter:text-ubepsa first-letter:mr-1">{p}</p>
              ))}
            </div>
            
            <div className="mt-12 sm:mt-20 pt-8 border-t border-slate-100">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 text-center">Story Tags</p>
               <div className="flex flex-wrap justify-center gap-2">
                 {article.tags.map(t => (
                   <span key={t} className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-xl text-xs font-bold border border-slate-100 hover:border-ubepsa hover:text-ubepsa transition-colors cursor-default">#{t}</span>
                 ))}
               </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
