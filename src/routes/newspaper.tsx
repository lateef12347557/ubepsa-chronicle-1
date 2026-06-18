import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/newspaper')({
  component: NewspaperPage,
});

function NewspaperPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <header className="mb-20 border-b border-slate-100 pb-16">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-xs font-black uppercase tracking-[0.2em] mb-6">
          Official Publications
        </div>
        <h1 className="text-5xl sm:text-8xl font-black text-slate-900 tracking-tighter mb-8">UBEPSA <span className="text-ubepsa">Newsletter.</span></h1>
        <p className="text-2xl text-slate-500 font-medium italic">"The Voice of Physiotherapy Students at UNIBEN"</p>
      </header>
      
      <div className="grid gap-16 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-20">
          {/* Main news item */}
          <article className="group">
            <div className="aspect-video bg-slate-50 rounded-[2.5rem] mb-10 flex items-center justify-center border border-slate-100 overflow-hidden shadow-2xl shadow-blue-900/5">
              <span className="text-slate-300 font-black text-2xl uppercase tracking-widest group-hover:scale-110 transition-transform duration-700">Latest Edition Cover</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 mb-6 group-hover:text-ubepsa transition-colors leading-tight">
              UBEPSA Wins National Excellence Award in Physiotherapy
            </h2>
            <p className="text-slate-500 text-lg font-medium leading-relaxed mb-10">
              In a historic moment for the University of Benin, our association has been recognized at the national level for outstanding contributions to student welfare and professional development. This award marks a significant milestone in our journey toward professional excellence.
            </p>
            <button className="text-ubepsa font-black text-lg hover:translate-x-2 transition-transform inline-flex items-center gap-3">Read Full Story <span>→</span></button>
          </article>
        </div>
        
        <aside className="space-y-12">
          <div className="p-10 bg-slate-50 rounded-[2rem] border border-slate-100">
            <h3 className="text-sm font-black text-ubepsa uppercase tracking-[0.2em] border-b border-blue-100 pb-4 mb-8">Past Issues</h3>
            <ul className="space-y-8">
              {[3, 2, 1].map((i) => (
                <li key={i} className="flex gap-6 items-center group cursor-pointer">
                  <div className="w-20 h-24 bg-white rounded-2xl border border-slate-100 flex-shrink-0 group-hover:shadow-lg transition-all group-hover:-translate-y-1 flex items-center justify-center text-slate-200 font-black">V{i}</div>
                  <div>
                    <h4 className="font-black text-slate-900 group-hover:text-ubepsa transition-colors">UBEPSA News Vol. {i}</h4>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">March 2024</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="p-10 bg-ubepsa rounded-[2rem] text-white">
             <h4 className="text-xl font-black mb-4">Contribute</h4>
             <p className="text-blue-100 text-sm font-medium mb-8 leading-relaxed">Have a story or article you'd like to feature in our next edition?</p>
             <button className="w-full py-4 bg-white text-ubepsa rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all">Submit Article</button>
          </div>
        </aside>
      </div>
    </div>
  );
}

