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
    <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className="min-h-full py-10 px-4 flex items-start justify-center">
        <article
          className="bg-cream max-w-3xl w-full shadow-2xl page-fade"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <img src={article.cover} alt={article.title} className="w-full h-72 sm:h-96 object-cover" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-cream text-ink font-mono text-xs px-3 py-2 tracking-[0.18em] uppercase hover:bg-press-red hover:text-cream transition-colors"
            >
              Close ✕
            </button>
          </div>
          <div className="p-6 sm:p-10">
            <span className="stamp text-press-red">{article.category}</span>
            <h1 className="font-display font-black text-3xl sm:text-5xl leading-tight mt-4 text-ink">{article.title}</h1>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ink/60">
              <span>By {article.author}</span>
              <span>·</span>
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
            <div className="mt-8 font-serif text-[1.05rem] leading-[1.8] text-ink/90 space-y-5">
              {paragraphs.map((p, i) => (
                <p key={i} className={i === 0 ? "dropcap" : ""}>{p}</p>
              ))}
              {paragraphs.length > 1 && (
                <blockquote className="pull-quote">
                  "{paragraphs[1].split(".")[0]}."
                </blockquote>
              )}
            </div>
            <div className="mt-8 pt-6 border-t border-ink/20 flex flex-wrap gap-2">
              {article.tags.map(t => (
                <span key={t} className="font-mono text-[0.65rem] tracking-[0.2em] uppercase px-2.5 py-1 bg-ink/5 text-ink/80">#{t}</span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
