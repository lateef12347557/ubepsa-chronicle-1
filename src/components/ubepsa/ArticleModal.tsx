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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="min-h-full py-8 px-4 flex items-start justify-center">
        <article
          className="bg-paper max-w-4xl w-full shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] page-fade border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="img-frame">
              <img src={article.cover} alt={article.title} className="w-full h-72 sm:h-[28rem] object-cover" />
            </div>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 kicker bg-paper/90 text-ink px-4 py-2 backdrop-blur border border-white/20 hover:bg-press-red hover:border-press-red transition-colors"
            >
              Close ✕
            </button>
            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-12">
              <span className="stamp stamp-solid">{article.category}</span>
              <h1 className="mega-display text-3xl sm:text-6xl leading-[0.95] mt-5 text-ink max-w-4xl">{article.title}</h1>
            </div>
          </div>
          <div className="p-6 sm:p-12">
            <div className="flex flex-wrap gap-x-6 gap-y-1 kicker text-ink/50 border-b border-white/10 pb-5">
              <span>By <span className="text-ink">{article.author}</span></span>
              <span>{article.date}</span>
              <span>{article.readTime} min read</span>
            </div>
            <div className="mt-10 font-sans text-[1.05rem] leading-[1.85] text-ink/80 space-y-6 max-w-2xl mx-auto">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "dropcap font-serif text-[1.15rem]" : ""}>{p}</p>
              ))}
              {paragraphs.length > 1 && (
                <blockquote className="pull-quote">
                  "{paragraphs[1].split(".")[0]}."
                </blockquote>
              )}
            </div>
            <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap gap-2">
              {article.tags.map(t => (
                <span key={t} className="kicker px-3 py-1.5 bg-white/5 text-ink/70 border border-white/10">#{t}</span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
