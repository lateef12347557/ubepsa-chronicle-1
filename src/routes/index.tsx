import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { ArticleCard } from "@/components/ubepsa/ArticleCard";
import { ArticleModal } from "@/components/ubepsa/ArticleModal";
import type { Article } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { articles } = useUbepsa();
  const [open, setOpen] = useState<Article | null>(null);

  const hero = articles[0];
  const secondary = articles.slice(1, 4);

  return (
    <div className="bg-white selection:bg-ubepsa selection:text-white">
      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-32 pb-48 overflow-hidden bg-white">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[1000px] h-[1000px] bg-blue-50 rounded-full blur-[120px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-blue-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-10 reveal in">
               <div className="h-[2px] w-12 bg-ubepsa" />
               <span className="text-sm font-black text-ubepsa uppercase tracking-[0.3em]">Official Student Portal</span>
            </div>
            
            <h1 className="mega-display text-slate-900 mb-10 reveal in">
              The Voice of <br />
              <span className="text-ubepsa">Physiotherapy</span> <br className="hidden sm:block" /> 
              at UNIBEN.
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-12 max-w-2xl font-medium reveal in" style={{ transitionDelay: '100ms' }}>
              Building a vibrant community, fostering academic excellence, and advancing the profession together.
            </p>
            
            <div className="flex flex-wrap gap-6 reveal in" style={{ transitionDelay: '200ms' }}>
              <Link to="/about" className="btn-modern bg-ubepsa text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-ubepsa-dark shadow-2xl shadow-blue-500/30 hover:-translate-y-1 transition-all">
                The Association
              </Link>
              <Link to="/excos" className="btn-modern bg-white text-slate-900 border-2 border-slate-100 px-12 py-5 rounded-2xl font-black text-lg hover:border-ubepsa hover:text-ubepsa transition-all shadow-sm">
                Meet Excos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ASSOCIATION UPDATES ============ */}
      <section className="relative z-10 -mt-20 max-w-7xl mx-auto px-6 pb-32">
        <div className="grid lg:grid-cols-3 gap-8">
           {/* Primary Featured Card */}
           <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Association News</h2>
                 <Link to="/articles" className="text-sm font-black text-ubepsa uppercase tracking-widest hover:underline">View All →</Link>
              </div>
              
              {hero ? (
                <div onClick={() => setOpen(hero)} className="group cursor-pointer bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10 hover:-translate-y-1">
                   <div className="aspect-[21/9] overflow-hidden bg-slate-50 relative">
                      <img src={hero.cover} alt={hero.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute top-6 left-6">
                         <span className="bg-ubepsa text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">{hero.category}</span>
                      </div>
                   </div>
                   <div className="p-10">
                      <h3 className="text-4xl font-black text-slate-900 mb-6 group-hover:text-ubepsa transition-colors leading-tight">{hero.title}</h3>
                      <p className="text-slate-500 text-lg leading-relaxed mb-8 line-clamp-2 font-medium">{hero.excerpt}</p>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-ubepsa font-black text-lg">
                            {hero.author[0]}
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-900">{hero.author}</p>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{hero.date}</p>
                         </div>
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-96 rounded-[2.5rem] bg-slate-50 flex items-center justify-center text-slate-300 font-bold border-2 border-dashed border-slate-100 italic">
                   No recent updates found
                </div>
              )}
           </div>

           {/* Secondary List */}
           <div className="lg:col-span-1 pt-16 lg:pt-0">
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Recent Stories</h2>
              <div className="space-y-6">
                 {secondary.length > 0 ? secondary.map((a) => (
                    <div key={a.id} onClick={() => setOpen(a)} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm transition-all hover:border-ubepsa hover:shadow-md cursor-pointer group">
                       <span className="text-[10px] font-black text-ubepsa uppercase tracking-[0.2em] mb-3 block">{a.category}</span>
                       <h4 className="text-xl font-bold text-slate-900 group-hover:text-ubepsa transition-colors leading-tight mb-4">{a.title}</h4>
                       <p className="text-sm text-slate-400 font-bold">{a.date}</p>
                    </div>
                 )) : (
                    [1,2,3].map(i => (
                       <div key={i} className="h-32 bg-slate-50 rounded-3xl border border-dashed border-slate-100" />
                    ))
                 )}
              </div>
           </div>
        </div>
      </section>

      {/* ============ QUICK ACTIONS GRID ============ */}
      <section className="bg-slate-50 py-32 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-6">
            <header className="mb-16 text-center">
               <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-6">Explore <span className="text-ubepsa">Association.</span></h2>
               <p className="text-lg text-slate-500 font-medium">Everything you need to know about UBEPSA UNIBEN.</p>
            </header>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
               <ActionCard to="/event" title="Events" desc="Seminars, workshops, and social gatherings." icon="EV" />
               <ActionCard to="/scholarship" title="Scholarship" desc="Financial aid and academic grants." icon="SC" />
               <ActionCard to="/gallery" title="Gallery" desc="Moments from our campus life." icon="GA" />
               <ActionCard to="/about" title="About Us" desc="Our mission, vision, and team." icon="AB" />
            </div>
         </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function ActionCard({ to, title, desc, icon }: { to: string, title: string, desc: string, icon: string }) {
   return (
      <Link to={to} className="group p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10 hover:-translate-y-2 hover:border-ubepsa">
         <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-ubepsa font-black text-xl mb-8 group-hover:bg-ubepsa group-hover:text-white transition-all duration-300">
            {icon}
         </div>
         <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-ubepsa transition-colors">{title}</h3>
         <p className="text-slate-500 font-medium leading-relaxed text-sm">{desc}</p>
         <div className="mt-8 flex items-center gap-2 text-ubepsa opacity-0 group-hover:opacity-100 transition-all">
            <span className="text-xs font-black uppercase tracking-widest">Learn More</span>
            <span>→</span>
         </div>
      </Link>
   );
}
