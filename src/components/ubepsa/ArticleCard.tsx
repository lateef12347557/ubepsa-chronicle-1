import type { Article } from "@/lib/ubepsa-store";

export function ArticleCard({ article, onOpen, size = "md" }: { article: Article; onOpen: (a: Article) => void; size?: "sm" | "md" | "lg" }) {
  const ratio = size === "lg" ? "aspect-[16/10]" : size === "sm" ? "aspect-[4/5]" : "aspect-[5/4]";
  const titleSize = size === "lg" ? "text-xl sm:text-3xl" : size === "sm" ? "text-lg" : "text-lg sm:text-2xl";

  return (
    <article
      onClick={() => onOpen(article)}
      className="card-modern group cursor-pointer h-full flex flex-col bg-white overflow-hidden"
    >
      <div className={`relative overflow-hidden ${ratio} bg-slate-50`}>
        <img
          src={article.cover || "/ed1.jpg"}
          alt={article.title}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = "/ed1.jpg"; }}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="bg-ubepsa text-white px-3 py-1 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-5 sm:p-8 flex-1 flex flex-col">
        <h3 className={`font-black ${titleSize} leading-tight text-slate-900 group-hover:text-ubepsa transition-colors mb-3`}>
          {article.title}
        </h3>
        <p className="text-slate-500 text-sm sm:text-base line-clamp-2 leading-relaxed mb-6 font-medium">
          {article.excerpt}
        </p>
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-[10px] font-black text-ubepsa shadow-sm">
              {article.author[0]}
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[80px] sm:max-w-none">{article.author}</span>
          </div>
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{article.readTime} min read</span>
        </div>
      </div>
    </article>
  );
}
