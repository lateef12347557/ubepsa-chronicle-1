import { createFileRoute, Link } from '@tanstack/react-router';
import { useUbepsa } from '@/components/ubepsa/UbepsaProvider';
import { Calendar, MapPin, ArrowLeft, Share2 } from 'lucide-react';

export const Route = createFileRoute('/event/$eventId')({
  component: EventDetail,
});

function EventDetail() {
  const { eventId } = Route.useParams();
  const { events } = useUbepsa();
  const event = events.find((e) => e.id === eventId);

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Event Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">The activity you are looking for might have been moved or removed.</p>
        <Link to="/event" className="btn-modern bg-ubepsa text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest">
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-20">
        <Link to="/event" className="inline-flex items-center gap-2 text-slate-400 hover:text-ubepsa font-black text-[10px] uppercase tracking-widest transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Schedule
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-20 items-start">
          {/* Left: Content */}
          <div className="space-y-8 sm:space-y-12">
            <div>
              <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-widest mb-6">
                 Departmental Activity
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap gap-6 sm:gap-10">
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-50 flex items-center justify-center text-ubepsa">
                       <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Date & Time</p>
                       <p className="text-sm sm:text-base font-bold text-slate-900">{event.date}</p>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-50 flex items-center justify-center text-ubepsa">
                       <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Location</p>
                       <p className="text-sm sm:text-base font-bold text-slate-900">{event.location}</p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-6">
              <button onClick={() => window.print()} className="btn-modern bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/10 hover:-translate-y-1 transition-all">
                Add to Calendar
              </button>
              <button className="btn-modern bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:border-ubepsa hover:text-ubepsa transition-all flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Invite Others
              </button>
            </div>
          </div>

          {/* Right: Media */}
          <div className="space-y-8">
            <div className="aspect-[4/5] bg-slate-50 rounded-[2.5rem] sm:rounded-[4rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-8 border-white">
              {event.image_url ? (
                <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-200 font-black text-3xl uppercase tracking-[0.2em] p-12 text-center">
                  Official UBEPSA Event Banner
                </div>
              )}
            </div>
            
            <div className="bg-blue-50 p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border border-blue-100">
               <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight">Need more info?</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">If you have specific questions about this event, feel free to contact the association executives or the event coordinator.</p>
               <Link to="/about" className="text-ubepsa font-black text-xs uppercase tracking-widest border-b-2 border-ubepsa pb-1">Contact Coordination Team</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
