import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import type { GalleryItem } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/gallery")({ component: GalleryPage });

function GalleryPage() {
  const { gallery } = useUbepsa();
  const albums = ["All", ...Array.from(new Set(gallery.map(g => g.album)))];
  const [album, setAlbum] = useState("All");
  const [idx, setIdx] = useState<number | null>(null);

  const filtered = useMemo(() => album === "All" ? gallery : gallery.filter(g => g.album === album), [album, gallery]);
  const current: GalleryItem | null = idx === null ? null : filtered[idx] ?? null;

  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx(i => (i === null ? null : (i + 1) % filtered.length));
      if (e.key === "ArrowLeft") setIdx(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [idx, filtered.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <header className="mb-12 sm:mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
          Visual Memories
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">Our <span className="text-ubepsa">Gallery.</span></h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">Moments and memories from our department and vibrant campus life.</p>
      </header>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-12 sm:mb-16">
        {albums.map(a => (
          <button
            key={a}
            onClick={() => setAlbum(a)}
            className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-black transition-all active:scale-95 ${
              album === a 
                ? "bg-ubepsa text-white shadow-xl shadow-blue-500/20" 
                : "bg-white text-slate-500 border-2 border-slate-100 hover:border-ubepsa hover:text-ubepsa"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filtered.map((g, i) => (
          <figure key={g.id} className="group cursor-zoom-in bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all hover:-translate-y-1" onClick={() => setIdx(i)}>
            <div className="aspect-square sm:aspect-[4/3] overflow-hidden bg-slate-50">
               <img src={g.url} alt={g.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
            <figcaption className="p-6 bg-white border-t border-slate-50">
              <p className="font-black text-slate-900 leading-tight mb-1">{g.title}</p>
              <div className="flex items-center gap-2">
                 <span className="h-1 w-1 rounded-full bg-ubepsa" />
                 <p className="text-[10px] font-bold text-ubepsa uppercase tracking-widest">{g.photographer} • {g.date}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 bg-white/98 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10" onClick={() => setIdx(null)}>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length)); }}
            className="absolute left-2 sm:left-10 top-1/2 -translate-y-1/2 text-ubepsa text-5xl sm:text-7xl font-light hover:scale-110 transition-all z-10 p-4"
            aria-label="Previous"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i === null ? null : (i + 1) % filtered.length)); }}
            className="absolute right-2 sm:right-10 top-1/2 -translate-y-1/2 text-ubepsa text-5xl sm:text-7xl font-light hover:scale-110 transition-all z-10 p-4"
            aria-label="Next"
          >›</button>
          <button
            onClick={() => setIdx(null)}
            className="absolute top-6 right-6 bg-ubepsa text-white px-5 py-3 rounded-2xl font-black hover:bg-ubepsa-dark transition-all shadow-xl active:scale-95"
          >✕ Close</button>
          
          <div className="max-w-6xl w-full flex flex-col lg:flex-row gap-8 sm:gap-12 items-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 flex items-center justify-center w-full">
              <img src={current.url} alt={current.title} className="max-h-[60vh] sm:max-h-[75vh] w-auto rounded-2xl sm:rounded-[2.5rem] shadow-2xl border-4 sm:border-8 border-white" />
            </div>
            <div className="w-full lg:w-96 text-center lg:text-left bg-white p-6 sm:p-10 rounded-[2rem] shadow-2xl shadow-blue-900/5">
              <span className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-widest mb-4">{current.album}</span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 leading-tight">{current.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-8 italic font-medium text-sm sm:text-base">{current.caption}</p>
              <div className="border-t border-slate-100 pt-6 flex items-center justify-center lg:justify-start gap-4">
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-ubepsa font-black">{current.photographer[0]}</div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Captured By</p>
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-none mt-1">{current.photographer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

