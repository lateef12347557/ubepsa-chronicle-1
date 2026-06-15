import type { Article } from "@/lib/ubepsa-store";

export function ArticleCard({ article, onOpen, size = "md" }: { article: Article; onOpen: (a: Article) => void; size?: "sm" | "md" | "lg" }) {
  const ratio = size === "lg" ? "aspect-[16/10]" : size === "sm" ? "aspect-[4/5]" : "aspect-[5/4]";
  const titleSize = size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-lg" : "text-xl sm:text-2xl";

  return (
    <article
      onClick={() => onOpen(article)}
      className="bento group cursor-pointer h-full flex flex-col"
    >
      <div className={`relative overflow-hidden ${ratio}`}>
        <img
          src={article.cover}
          alt={article.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/30 to-transparent" />
        <span className="absolute top-3 left-3 stamp stamp-dot">{article.category}</span>
      </div>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className={`font-display ${titleSize} leading-[1.15] text-ink group-hover:text-gradient transition-all duration-500`}>
          {article.title}
        </h3>
        <p className="mt-3 text-sm text-ink/55 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[0.62rem] tracking-[0.2em] uppercase text-ink/45">
          <span className="truncate">{article.author}</span>
          <span className="shrink-0 ml-2">{article.readTime} min</span>
        </div>
      </div>
    </article>
  );
}
