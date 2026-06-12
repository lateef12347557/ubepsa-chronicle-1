import type { Article } from "@/lib/ubepsa-store";

export function ArticleCard({ article, onOpen }: { article: Article; onOpen: (a: Article) => void }) {
  return (
    <article
      className="card-bold group cursor-pointer"
      onClick={() => onOpen(article)}
    >
      <div className="overflow-hidden relative aspect-[5/4]">
        <img
          src={article.cover}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06] opacity-90 group-hover:opacity-100"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 stamp text-ink">{article.category}</span>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl leading-[1.1] text-ink group-hover:text-press-red transition-colors duration-500">
          {article.title}
        </h3>
        <p className="mt-3 font-sans text-sm text-ink/60 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between kicker text-ink/45">
          <span>{article.author}</span>
          <span>{article.date} · {article.readTime}m</span>
        </div>
      </div>
    </article>
  );
}
