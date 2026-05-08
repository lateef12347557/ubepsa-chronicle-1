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
    <div className="page-fade max-w-7xl mx-auto px-4 py-12">
      <div className="rule-double py-3 mb-8">
        <h1 className="font-display font-black text-4xl sm:text-5xl">Gallery</h1>
        <p className="font-serif italic text-ink/70 mt-1">The campus, framed.</p>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-8">
        {albums.map(a => (
          <button
            key={a}
            onClick={() => setAlbum(a)}
            className={`font-mono text-[0.65rem] tracking-[0.18em] uppercase px-3 py-1.5 border transition-colors ${album === a ? "bg-ink text-cream border-ink" : "border-ink/30 text-ink/70 hover:border-press-red hover:text-press-red"}`}
          >
            {a}
          </button>
        ))}
      </div>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 [column-fill:_balance]">
        {filtered.map((g, i) => (
          <figure key={g.id} className="mb-4 break-inside-avoid lift cursor-zoom-in bg-card" onClick={() => setIdx(i)}>
            <img src={g.url} alt={g.title} loading="lazy" className="w-full h-auto block" />
            <figcaption className="p-3">
              <p className="font-display font-bold text-base text-ink leading-snug">{g.title}</p>
              <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-ink/55 mt-1">© {g.photographer} · {g.date}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4" onClick={() => setIdx(null)}>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i === null ? null : (i - 1 + filtered.length) % filtered.length)); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cream text-4xl font-display hover:text-gold z-10 px-4"
            aria-label="Previous"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setIdx(i => (i === null ? null : (i + 1) % filtered.length)); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-cream text-4xl font-display hover:text-gold z-10 px-4"
            aria-label="Next"
          >›</button>
          <button
            onClick={() => setIdx(null)}
            className="absolute top-4 right-4 bg-cream text-ink font-mono text-xs tracking-[0.18em] uppercase px-3 py-2 hover:bg-press-red hover:text-cream"
          >Close ✕</button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={current.url} alt={current.title} className="max-h-[78vh] w-auto mx-auto block" />
            <div className="mt-5 text-cream text-center max-w-2xl mx-auto">
              <h3 className="font-display font-bold text-2xl">{current.title}</h3>
              <p className="font-serif italic text-cream/85 mt-2">{current.caption}</p>
              <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-gold mt-3">© {current.photographer} · {current.date} · {current.album}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
