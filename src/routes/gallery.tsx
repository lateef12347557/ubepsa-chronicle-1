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
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12 border-b border-slate-100 pb-8">
        <h1 className="text-4xl font-bold text-blue-900">Gallery</h1>
        <p className="text-slate-600 mt-2">Moments and memories from our department and campus life.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        {albums.map(a => (
          <button
            key={a}
            onClick={() => setAlbum(a)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${album === a ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-600 hover:text-blue-600"}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
        {filtered.map((g, i) => (
          <figure key={g.id} className="mb-6 break-inside-avoid group cursor-zoom-in bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow" onClick={() => setIdx(i)}>
            <img src={g.url} alt={g.title} loading="lazy" className="w-full h-auto block group-hover:scale-105 transition-transform duration-500" />
            <figcaption className="p-4 bg-white border-t border-slate-50">
              <p className="font-bold text-blue-900 leading-snug">{g.title}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">{g.photographer} • {g.date}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10" onClick={() => setIdx(null)}>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length)); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900 text-6xl font-light hover:text-blue-600 z-10 p-4 transition-colors"
            aria-label="Previous"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i === null ? null : (i + 1) % filtered.length)); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-900 text-6xl font-light hover:text-blue-600 z-10 p-4 transition-colors"
            aria-label="Next"
          >›</button>
          <button
            onClick={() => setIdx(null)}
            className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-lg"
          >✕ Close</button>
          
          <div className="max-w-6xl w-full flex flex-col md:flex-row gap-8 items-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex-1 flex items-center justify-center">
              <img src={current.url} alt={current.title} className="max-h-[70vh] w-auto rounded-2xl shadow-2xl" />
            </div>
            <div className="md:w-80 text-left">
              <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-4">{current.album}</span>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">{current.title}</h3>
              <p className="text-slate-600 leading-relaxed mb-6 italic">{current.caption}</p>
              <div className="border-t border-slate-100 pt-6">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">Photographer</p>
                <p className="text-sm font-medium text-slate-900 mt-1">{current.photographer}</p>
                <p className="text-xs text-slate-400 mt-1">{current.date}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

