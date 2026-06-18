import { createFileRoute, Link } from '@tanstack/react-router';
import { useUbepsa } from '@/components/ubepsa/UbepsaProvider';

export const Route = createFileRoute('/event')({
  component: UbepsaEventPage,
});

function UbepsaEventPage() {
  const { events } = useUbepsa();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <header className="mb-12 sm:mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
          Departmental Activities
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">UBEPSA <span className="text-ubepsa">Events.</span></h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">Stay updated with the latest seminars, workshops, and social gatherings in our community.</p>
      </header>
      
      {events.length > 0 ? (
        <div className="grid gap-6 sm:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div key={e.id} className="group bg-white rounded-3xl sm:rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden transition-all hover:shadow-blue-900/10 hover:-translate-y-2">
              <div className="h-48 sm:h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                {e.image_url ? (
                  <img src={e.image_url} alt={e.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <span className="text-slate-300 font-black text-xl uppercase tracking-widest group-hover:scale-110 transition-transform duration-700">UBEPSA Event</span>
                )}
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg text-center min-w-[60px] sm:min-w-[80px]">
                  <p className="text-ubepsa font-black text-[10px] sm:text-xs uppercase tracking-widest leading-tight">{e.date.split(" ").slice(0, 2).join(" ")}</p>
                </div>
              </div>
              <div className="p-6 sm:p-10">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 mb-3 sm:mb-4 group-hover:text-ubepsa transition-colors leading-tight">{e.title}</h3>
                <p className="text-slate-500 font-medium text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed line-clamp-3">{e.description}</p>
                <div className="flex items-center justify-between pt-6 sm:pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-ubepsa animate-pulse" />
                     <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px] sm:max-w-none">{e.location}</span>
                  </div>
                  <Link to="/event/$eventId" params={{ eventId: e.id }} className="text-ubepsa font-black text-[10px] sm:text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">Details →</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 sm:py-32 text-center border-2 border-dashed border-slate-100 rounded-3xl sm:rounded-[4rem] bg-slate-50 shadow-inner">
          <div className="max-w-md mx-auto px-6">
            <p className="text-slate-400 font-black text-xl sm:text-2xl mb-2 leading-tight">No upcoming events at the moment.</p>
            <p className="text-slate-400 font-medium text-sm sm:text-base">Check back soon for exciting departmental activities and association gatherings!</p>
          </div>
        </div>
      )}
    </div>
  );
}
