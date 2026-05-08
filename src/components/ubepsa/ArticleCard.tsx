import type { Article } from "@/lib/ubepsa-store";

export function ArticleCard({ article, onOpen }: { article: Article; onOpen: (a: Article) => void }) {
  return (
    <article className="lift bg-card cursor-pointer group" onClick={() => onOpen(article)}>
      <div className="overflow-hidden">
        <img src={article.cover} alt={article.title} className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="stamp text-press-red">{article.category}</span>
          <span className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ink/50">{article.readTime} min</span>
        </div>
        <h3 className="font-display font-bold text-xl leading-snug text-ink group-hover:text-press-red transition-colors">
          {article.title}
        </h3>
        <p className="mt-2 font-serif text-sm text-ink/75 line-clamp-3">{article.excerpt}</p>
        <div className="mt-4 pt-3 border-t border-ink/10 font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ink/60 flex justify-between">
          <span>{article.author}</span>
          <span>{article.date}</span>
        </div>
      </div>
    </article>
  );
}
