import { createFileRoute } from '@tanstack/react-router';
import { useUbepsa } from '@/components/ubepsa/UbepsaProvider';

export const Route = createFileRoute('/event')({
  component: UbepsaEventPage,
});

function UbepsaEventPage() {
  const { events } = useUbepsa();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <header className="mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          Departmental Activities
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-6">UBEPSA <span className="text-ubepsa">Events.</span></h1>
        <p className="text-lg text-slate-500 max-w-2xl font-medium">Stay updated with the latest seminars, workshops, and social gatherings in our community.</p>
      </header>
      
      {events.length > 0 ? (
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <div key={e.id} className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-blue-900/5 overflow-hidden transition-all hover:shadow-blue-900/10 hover:-translate-y-2">
              <div className="h-64 bg-slate-50 flex items-center justify-center relative overflow-hidden">
                {e.image_url ? (
                  <img src={e.image_url} alt={e.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <span className="text-slate-300 font-black text-xl uppercase tracking-widest group-hover:scale-110 transition-transform duration-700">UBEPSA Event</span>
                )}
                <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm text-center">
                  <p className="text-ubepsa font-black text-xs uppercase tracking-widest">{e.date.split(" ").slice(0, 2).join(" ")}</p>
                </div>
              </div>
              <div className="p-10">
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-ubepsa transition-colors">{e.title}</h3>
                <p className="text-slate-500 font-medium text-sm mb-8 leading-relaxed line-clamp-3">{e.description}</p>
                <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem] bg-slate-50">
          <p className="text-slate-400 font-black text-xl">No upcoming events at the moment.</p>
          <p className="text-slate-400 font-medium mt-2">Check back soon for exciting departmental activities!</p>
        </div>
      )}
    </div>
  );
}
