import type { UbepsaEvent } from "@/lib/ubepsa-store";
import { useEffect } from "react";
import { Calendar, MapPin, X, Share2, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function EventModal({ event, onClose }: { event: UbepsaEvent | null; onClose: () => void }) {
  useEffect(() => {
    if (!event) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [event, onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md overflow-y-auto" onClick={onClose}>
      <div className="min-h-full py-4 sm:py-12 px-4 flex items-start justify-center">
        <div
          className="bg-white max-w-4xl w-full rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative aspect-video sm:aspect-[21/9]">
            <img src={event.image_url || "/exco1.jfif"} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 bg-white/95 text-ubepsa p-2 sm:p-3 rounded-xl font-black shadow-xl hover:bg-ubepsa hover:text-white transition-all active:scale-95"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
               <span className="bg-ubepsa text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">Featured Event</span>
            </div>
          </div>
          
          <div className="p-6 sm:p-12 lg:p-16">
            <div className="grid lg:grid-cols-3 gap-10">
               <div className="lg:col-span-2 space-y-8">
                  <div>
                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tighter mb-6">{event.title}</h1>
                    
                    <div className="flex flex-wrap gap-6 sm:gap-8">
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-ubepsa">
                             <Calendar className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Scheduled</p>
                             <p className="text-xs sm:text-sm font-bold text-slate-900">{event.date}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-ubepsa">
                             <MapPin className="h-5 w-5" />
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">Venue</p>
                             <p className="text-xs sm:text-sm font-bold text-slate-900">{event.location}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="prose prose-slate max-w-none">
                    <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                      {event.description}
                    </p>
                  </div>
               </div>

               <div className="lg:col-span-1">
                  <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-100 space-y-6 sticky top-0">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Quick Actions</p>
                     
                     <div className="space-y-3">
                        <Link 
                          to="/event/$eventId" 
                          params={{ eventId: event.id }} 
                          className="w-full flex items-center justify-center gap-2 bg-ubepsa text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:-translate-y-1 transition-all"
                        >
                           <ExternalLink className="h-4 w-4" />
                           Open Full Page
                        </Link>
                        
                        <button className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:border-ubepsa hover:text-ubepsa transition-all">
                           <Share2 className="h-4 w-4" />
                           Share Event
                        </button>
                     </div>

                     <div className="pt-6 border-t border-slate-200">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Notice</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                           This event is organized by the University of Benin Physiotherapy Student Association.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
