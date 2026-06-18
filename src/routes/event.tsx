import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/event')({
  component: UbepsaEventPage,
});

function UbepsaEventPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <header className="mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-xs font-black uppercase tracking-[0.2em] mb-6">
          Departmental Activities
        </div>
        <h1 className="text-5xl sm:text-8xl font-black text-slate-900 tracking-tighter mb-8">UBEPSA <span className="text-ubepsa">Events.</span></h1>
        <p className="text-xl text-slate-500 max-w-2xl font-medium">Stay updated with the latest seminars, workshops, and social gatherings in our community.</p>
      </header>
      
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        <div className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden transition-all hover:shadow-blue-900/10 hover:-translate-y-2">
          <div className="h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
            <span className="text-slate-300 font-black text-xl uppercase tracking-widest group-hover:scale-110 transition-transform duration-700">Seminar Image</span>
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm text-center">
               <p className="text-ubepsa font-black text-xs uppercase tracking-widest">Oct 24</p>
            </div>
          </div>
          <div className="p-10">
            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-ubepsa transition-colors">Departmental Orientation</h3>
            <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed">Welcoming our newest members into the physiotherapy family with insights and guidance.</p>
            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Main Auditorium</span>
               <button className="text-ubepsa font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">Details →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
