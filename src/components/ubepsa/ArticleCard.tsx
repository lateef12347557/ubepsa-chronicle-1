import type { Article } from "@/lib/ubepsa-store";

export function ArticleCard({ article, onOpen, size = "md" }: { article: Article; onOpen: (a: Article) => void; size?: "sm" | "md" | "lg" }) {
  const ratio = size === "lg" ? "aspect-[16/10]" : size === "sm" ? "aspect-[4/5]" : "aspect-[5/4]";
  const titleSize = size === "lg" ? "text-2xl sm:text-3xl" : size === "sm" ? "text-lg" : "text-xl sm:text-2xl";

  return (
    <article
      onClick={() => onOpen(article)}
      className="bento group cursor-pointer h-full flex flex-col bg-white"
    >
      <div className={`relative overflow-hidden ${ratio} bg-slate-50`}>
        <img
          src={article.cover}
          alt={article.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="stamp stamp-solid !bg-blue-600 !text-white !border-none !rounded-md shadow-sm">{article.category}</span>
        </div>
      </div>
      <div className="p-5 sm:p-6 flex-1 flex flex-col">
        <h3 className={`font-bold ${titleSize} leading-tight text-blue-900 group-hover:text-blue-600 transition-colors`}>
          {article.title}
        </h3>
        <p className="mt-3 text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600 uppercase">
              {article.author[0]}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{article.author}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}

