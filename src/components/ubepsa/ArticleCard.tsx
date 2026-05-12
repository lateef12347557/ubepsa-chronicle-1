import type { Article } from "@/lib/ubepsa-store";

export function ArticleCard({ article, onOpen }: { article: Article; onOpen: (a: Article) => void }) {
  return (
    <article
      className="card-bold cursor-pointer group border border-ink/10"
      onClick={() => onOpen(article)}
    >
      <div className="overflow-hidden relative">
        <img
          src={article.cover}
          alt={article.title}
          className="w-full aspect-[5/4] object-cover transition-transform duration-[700ms] ease-out group-hover:scale-110"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 stamp stamp-solid">{article.category}</span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display font-black text-xl sm:text-2xl leading-[1.1] text-ink group-hover:text-press-red transition-colors">
          {article.title}
        </h3>
        <p className="mt-3 font-serif text-[0.95rem] text-ink/75 line-clamp-3 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-5 pt-3 border-t border-ink/10 flex items-center justify-between kicker text-ink/55">
          <span>{article.author}</span>
          <span>{article.date} · {article.readTime}m</span>
        </div>
      </div>
    </article>
  );
}
