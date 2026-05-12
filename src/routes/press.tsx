import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import type { PressRelease } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/press")({ component: PressPage });

function PressPage() {
  const { releases } = useUbepsa();
  const [open, setOpen] = useState<PressRelease | null>(null);

  return (
    <div className="page-fade max-w-5xl mx-auto px-4 py-12">
      <div className="rule-double py-3 mb-8">
        <h1 className="font-display font-black text-4xl sm:text-5xl">Press Releases</h1>
        <p className="font-serif italic text-ink/70 mt-1">Official statements from the UBEPSA Editorial & Press board.</p>
      </div>

      <ul className="divide-y divide-ink/15 border-y-2 border-ink">
        {releases.map(r => (
          <li key={r.id} className="press-watermark py-6 grid md:grid-cols-[7rem_1fr_auto] gap-4 md:gap-6 items-start">
            <div className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ink/70">
              <div className="text-press-red font-bold">Release</div>
              <div className="mt-1">{r.date}</div>
              <div className="mt-1 text-ink/50">{r.issuer}</div>
            </div>
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-ink leading-snug">{r.title}</h2>
              <p className="mt-2 font-serif text-ink/80">{r.summary}</p>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <button onClick={() => setOpen(r)} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase bg-ink text-cream px-4 py-2 hover:bg-press-red transition-colors">
                Read Full Release
              </button>
              <button className="font-mono text-[0.65rem] tracking-[0.18em] uppercase border border-ink/40 text-ink/70 px-4 py-2 hover:border-press-red hover:text-press-red transition-colors">
                ⤓ PDF
              </button>
            </div>
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm overflow-y-auto" onClick={() => setOpen(null)}>
          <div className="min-h-full py-10 px-4 flex items-start justify-center">
            <div className="bg-cream max-w-2xl w-full p-8 sm:p-12 page-fade press-watermark" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start gap-4">
                <span className="stamp text-press-red">For Immediate Release</span>
                <button onClick={() => setOpen(null)} className="font-mono text-xs tracking-[0.18em] uppercase text-ink/60 hover:text-press-red">Close ✕</button>
              </div>
              <h1 className="font-display font-black text-3xl mt-4 text-ink">{open.title}</h1>
              <p className="font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ink/60 mt-2">{open.date} · {open.issuer}</p>
              <div className="mt-6 font-serif text-ink/90 leading-[1.8] space-y-4">
                {open.body.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-8 pt-6 border-t border-ink/20 font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ink/60">
                — Ends —
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
