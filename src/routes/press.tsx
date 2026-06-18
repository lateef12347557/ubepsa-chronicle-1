import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import type { PressRelease } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/press")({ component: PressPage });

function PressPage() {
  const { releases } = useUbepsa();
  const [open, setOpen] = useState<PressRelease | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <header className="mb-12 sm:mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
          Official Statements
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">Press <span className="text-ubepsa">Releases.</span></h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">Official communications and statements from the UBEPSA Executive Council.</p>
      </header>

      <div className="space-y-6 sm:space-y-8">
        {releases.map(r => (
          <div key={r.id} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10 group">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 sm:gap-10">
              <div className="max-w-3xl flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-blue-50 text-ubepsa px-2.5 py-1 rounded-lg text-[8px] sm:text-[10px] font-black uppercase tracking-widest border border-blue-100">Official</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{r.date}</span>
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-slate-900 mb-4 leading-tight group-hover:text-ubepsa transition-colors">{r.title}</h2>
                <p className="text-slate-500 font-medium text-sm sm:text-lg leading-relaxed mb-8">{r.summary}</p>
                <div className="flex flex-col xs:flex-row gap-4">
                  <button onClick={() => setOpen(r)} className="bg-ubepsa text-white px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-black text-sm hover:bg-ubepsa-dark transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-center">
                    Read Full Statement
                  </button>
                  <button className="bg-slate-50 text-slate-600 px-6 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-black text-sm hover:bg-slate-100 transition-all active:scale-95 text-center">
                    Download Archive
                  </button>
                </div>
              </div>
              <div className="hidden lg:block bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[240px]">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Issuing Authority</p>
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-ubepsa font-black">U</div>
                   <p className="text-sm font-bold text-slate-900 leading-tight">{r.issuer}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md overflow-y-auto" onClick={() => setOpen(null)}>
          <div className="min-h-full py-4 sm:py-12 px-4 flex items-start justify-center">
            <article 
              className="bg-white max-w-3xl w-full rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-ubepsa p-8 sm:p-12 text-white relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-10">
                    <span className="bg-white/20 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">For Immediate Release</span>
                    <button onClick={() => setOpen(null)} className="text-white/60 hover:text-white transition-colors">✕ Close</button>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black leading-tight tracking-tighter mb-4">{open.title}</h1>
                  <p className="text-blue-100 font-bold text-xs sm:text-sm uppercase tracking-widest">{open.date} · {open.issuer}</p>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              </div>
              <div className="p-8 sm:p-16">
                <div className="font-sans text-base sm:text-lg leading-relaxed text-slate-600 space-y-6 sm:space-y-8">
                  {open.body.split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                </div>
                <div className="mt-12 sm:mt-20 pt-10 border-t border-slate-100 text-center">
                  <div className="inline-block p-4 rounded-2xl bg-slate-50 mb-4">
                     <img src="/logo.jfif" alt="" className="h-10 w-10 object-contain opacity-50" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">— STATEMENT ENDS —</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      )}
    </div>
  );
}
