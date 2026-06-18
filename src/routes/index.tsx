import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { ArticleCard } from "@/components/ubepsa/ArticleCard";
import { ArticleModal } from "@/components/ubepsa/ArticleModal";
import { EventModal } from "@/components/ubepsa/EventModal";
import type { Article, UbepsaEvent } from "@/lib/ubepsa-store";
import { Calendar } from "lucide-react";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { articles, events, scholarships, gallery } = useUbepsa();
  const [open, setOpen] = useState<Article | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<UbepsaEvent | null>(null);

  const hero = articles[0];
  const secondary = articles.slice(1, 5);
  const featuredEvent = events[0];
  const secondaryEvents = events.slice(1, 5);
  const featuredEvents = events.slice(0, 4); // Keep for backwards compatibility if needed, but we'll use new vars
  const recentGallery = gallery.slice(0, 4);

  return (
    <div className="bg-white selection:bg-ubepsa selection:text-white">
      {/* ============ HERO SECTION ============ */}
      <section className="relative pt-20 pb-16 xs:pb-24 sm:pt-32 sm:pb-40 overflow-hidden bg-white">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-blue-50 rounded-full blur-[60px] sm:blur-[100px] opacity-60 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-8 reveal in">
               <div className="h-[2px] w-6 sm:w-10 bg-ubepsa" />
               <span className="text-[9px] sm:text-xs font-black text-ubepsa uppercase tracking-[0.2em] sm:tracking-[0.3em]">Official Student Website</span>
            </div>
            
            <h1 className="mega-display text-slate-900 mb-4 sm:mb-8 reveal in">
              The Voice of <br className="hidden xs:block" />
              <span className="text-ubepsa">UNIBEN </span> <br className="hidden sm:block" /> 
              Physiotherapy.
            </h1>
            
            <p className="text-sm sm:text-lg lg:text-xl text-slate-500 leading-relaxed mb-6 sm:mb-12 max-w-xl font-medium reveal in" style={{ transitionDelay: '100ms' }}>
              Building a vibrant community, fostering academic excellence, and advancing the profession together.
            </p>
            
            <div className="flex flex-wrap gap-3 sm:gap-4 reveal in" style={{ transitionDelay: '200ms' }}>
              <Link to="/about" className="btn-modern bg-ubepsa text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all">
                The Association
              </Link>
              <Link to="/excos" className="btn-modern bg-white text-slate-900 border-2 border-slate-100 px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black hover:border-ubepsa hover:text-ubepsa transition-all shadow-sm">
                Meet Excos
              </Link>
              <Link to="/articles" className="btn-modern bg-slate-900 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-xl font-black hover:bg-slate-800 transition-all shadow-sm">
                Latest News
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ASSOCIATION UPDATES ============ */}
      <section className="relative z-10 -mt-8 sm:-mt-16 max-w-7xl mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-10">
           {/* Primary Featured Card */}
           <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                 <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Association News</h2>
                 <Link to="/articles" className="text-[10px] sm:text-xs font-black text-ubepsa uppercase tracking-widest hover:underline">View All →</Link>
              </div>
              
              <div onClick={() => hero && setOpen(hero)} className="group cursor-pointer bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden border border-slate-100 shadow-lg sm:shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10 hover:-translate-y-1">
                 <div className="aspect-video xs:aspect-[21/9] overflow-hidden bg-slate-50 relative">
                    <img 
                      src={hero?.cover || "/ed1.jpg"} 
                      alt={hero?.title || "Welcome to UBEPSA"} 
                      onError={(e) => { (e.target as HTMLImageElement).src = "/ed1.jpg"; }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                       <span className="bg-ubepsa text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[7px] sm:text-[9px] font-black uppercase tracking-widest shadow-lg">{hero?.category || "Welcome"}</span>
                    </div>
                 </div>
                 <div className="p-5 sm:p-8">
                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 mb-3 sm:mb-4 group-hover:text-ubepsa transition-colors leading-tight">{hero?.title || "Advancing the Future of Physiotherapy Excellence"}</h3>
                    <p className="text-slate-500 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-2 font-medium">{hero?.excerpt || "Join us as we explore new frontiers in physiotherapy education and student welfare at the University of Benin."}</p>
                    <div className="flex items-center gap-2 sm:gap-3">
                       <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center text-ubepsa font-black text-sm sm:text-base shadow-sm">
                          {hero?.author[0] || "U"}
                       </div>
                       <div>
                          <p className="text-[10px] sm:text-xs font-black text-slate-900 leading-tight">{hero?.author || "UBEPSA Staff"}</p>
                          <p className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{hero?.date || "Latest Update"}</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Secondary List */}
           <div className="lg:col-span-1 pt-8 lg:pt-0">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mb-4 sm:mb-6 tracking-tight border-l-4 border-ubepsa pl-3">Recent Stories</h2>
              <div className="space-y-3 sm:space-y-4">
                 {secondary.length > 0 ? secondary.map((a) => (
                    <div key={a.id} onClick={() => setOpen(a)} className="p-4 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm transition-all hover:border-ubepsa hover:shadow-md cursor-pointer group">
                       <span className="text-[7px] sm:text-[9px] font-black text-ubepsa uppercase tracking-[0.2em] mb-1.5 block">{a.category}</span>
                       <h4 className="text-sm sm:text-lg font-bold text-slate-900 group-hover:text-ubepsa transition-colors leading-tight mb-2">{a.title}</h4>
                       <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">{a.date}</p>
                    </div>
                 )) : (
                    [1,2,3,4,5].map(i => (
                       <div key={i} className="p-4 sm:p-5 bg-white border border-slate-100 rounded-xl sm:rounded-2xl shadow-sm flex gap-4 items-center group cursor-pointer">
                          <div className="w-12 h-12 rounded-lg bg-slate-50 flex-shrink-0 overflow-hidden">
                             <img src={`/ed${(i % 3) + 1}.jpg`} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                          </div>
                          <div>
                             <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-ubepsa transition-colors leading-tight">Featured student development program update</h4>
                             <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">18 June 2026</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
              <Link to="/articles" className="btn-modern w-full mt-6 bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-ubepsa transition-all">
                Browse Newsroom
              </Link>
           </div>
        </div>
      </section>

      {/* ============ UPCOMING EVENTS ============ */}
      <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
            <div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter mb-2">Upcoming <span className="text-ubepsa">Events.</span></h2>
              <p className="text-slate-500 font-medium max-w-lg text-xs sm:text-sm">Don't miss out on our seminars, workshops, and social gatherings designed to enhance your campus experience.</p>
            </div>
            <Link to="/event" className="btn-modern text-[10px] font-black bg-white text-slate-900 border border-slate-200 px-6 py-2 rounded-lg uppercase tracking-widest shadow-sm hover:border-ubepsa hover:text-ubepsa transition-all">Full Calendar →</Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 sm:gap-10">
             {/* Main Event Card */}
             <div className="lg:col-span-2">
                <div 
                  onClick={() => featuredEvent && setSelectedEvent(featuredEvent)}
                  className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10"
                >
                   <div className="aspect-video overflow-hidden bg-slate-100 relative">
                      <img 
                        src={featuredEvent?.image_url || "/exco1.jfif"} 
                        alt={featuredEvent?.title || "Upcoming Activity"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                      <div className="absolute top-4 left-4">
                         <span className="bg-ubepsa text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg">Featured Event</span>
                      </div>
                   </div>
                   <div className="p-6 sm:p-10">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                         <div className="flex items-center gap-2">
                            <span className="bg-blue-50 text-ubepsa p-2 rounded-lg"><Calendar className="h-4 w-4" /></span>
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{featuredEvent?.date || "TBA"}</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400">
                            <span className="text-[10px] font-black uppercase tracking-widest">{featuredEvent?.location || "University of Benin"}</span>
                         </div>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 group-hover:text-ubepsa transition-colors leading-tight">{featuredEvent?.title || "Departmental Orientation & Welfare Summit"}</h3>
                      <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8 line-clamp-3 font-medium">{featuredEvent?.description || "A comprehensive gathering of all physiotherapy students to discuss academic excellence and professional growth."}</p>
                      <button className="btn-modern bg-slate-900 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-ubepsa transition-all shadow-lg shadow-blue-900/10 inline-block">View Details</button>
                   </div>
                </div>
             </div>

             {/* Smaller Event List */}
             <div className="lg:col-span-1 space-y-4">
                <h3 className="text-lg font-black text-slate-900 mb-6 tracking-tight border-l-4 border-ubepsa pl-3">More Activities</h3>
                <div className="space-y-4">
                   {secondaryEvents.length > 0 ? secondaryEvents.map(e => (
                      <div 
                        key={e.id} 
                        onClick={() => setSelectedEvent(e)}
                        className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-ubepsa hover:shadow-md transition-all group cursor-pointer block"
                      >
                         <div className="flex items-center gap-2 mb-2">
                            <span className="text-[8px] font-black text-ubepsa uppercase tracking-widest">{e.date}</span>
                         </div>
                         <h4 className="font-bold text-slate-900 group-hover:text-ubepsa transition-colors leading-tight mb-2">{e.title}</h4>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{e.location}</p>
                      </div>
                   )) : [1,2,3].map(i => (
                      <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm group">
                         <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest block mb-2">Upcoming Schedule</span>
                         <div className="h-4 w-2/3 bg-slate-50 rounded animate-pulse mb-3" />
                         <div className="h-3 w-1/3 bg-slate-50 rounded animate-pulse" />
                      </div>
                   ))}
                </div>
                <Link to="/event" className="btn-modern w-full mt-6 bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-ubepsa transition-all text-center block py-3 rounded-xl font-black text-[10px] uppercase tracking-widest">
                  Browse Schedule
                </Link>
             </div>
          </div>
        </div>
      </section>

      {/* ============ GALLERY PREVIEW ============ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">Association <span className="text-ubepsa">Moments.</span></h2>
            <div className="flex gap-2">
              <Link to="/gallery" className="btn-modern bg-slate-900 text-white text-[9px] uppercase tracking-widest px-4 py-2">Open Gallery</Link>
              <Link to="/about" className="btn-modern bg-white text-slate-900 border border-slate-200 text-[9px] uppercase tracking-widest px-4 py-2">Our History</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {(recentGallery.length > 0 ? recentGallery : [1,2,3,4]).map((g, i) => {
              const isReal = typeof g !== "number";
              const img = isReal ? g : {
                id: i.toString(),
                url: `/ed${(i % 3) + 1}.jpg`,
                title: "Student Life",
                date: "June 2026"
              };
              return (
                <div key={img.id} className="relative group overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer aspect-square">
                  <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p className="text-white font-black text-sm leading-tight mb-1">{img.title}</p>
                    <p className="text-slate-300 text-[8px] font-bold uppercase tracking-widest">{img.date}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Link to="/gallery" className="btn-modern bg-slate-900 text-white px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg hover:-translate-y-1 transition-all inline-block">
               Explore Full Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* ============ QUICK ACTIONS GRID ============ */}
      <section className="bg-slate-50 py-16 sm:py-24 border-y border-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <header className="mb-8 sm:mb-12 text-center">
               <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-3 sm:mb-4 leading-tight">Explore <span className="text-ubepsa">Association.</span></h2>
               <p className="text-sm sm:text-base text-slate-500 font-medium">Everything you need to know about UBEPSA UNIBEN.</p>
            </header>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
               <ActionCard to="/event" title="Events" desc="Seminars and social gatherings." icon="EV" />
               <ActionCard to="/gallery" title="Gallery" desc="Moments from our campus life." icon="GA" />
               <ActionCard to="/about" title="About Us" desc="Our mission, vision, and team." icon="AB" />
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-4">
              <Link to="/about" hash="editorial" className="btn-modern bg-white text-slate-900 border border-slate-200 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:border-ubepsa hover:text-ubepsa transition-all">
                Press  Staff
              </Link>
              <Link to="/admin" className="btn-modern bg-slate-900 text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-ubepsa transition-all">
                Admin Portal
              </Link>
              <Link to="/excos" className="btn-modern bg-blue-50 text-ubepsa border border-blue-100 px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-ubepsa hover:text-white transition-all">
                The Executive Council
              </Link>
            </div>
         </div>
      </section>

      {/* ============ QUICK CONNECT SECTION ============ */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-ubepsa rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
             <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl sm:text-5xl font-black tracking-tighter mb-6 leading-tight">Join the community. <br /> Stay <span className="text-blue-200">informed.</span></h2>
                <p className="text-blue-50 text-sm sm:text-lg font-medium mb-10 opacity-90">Get the latest updates, scholarship alerts, and departmental news delivered straight to your student portal.</p>
                <div className="flex flex-wrap gap-4">
                   <Link to="/articles" className="btn-modern bg-white text-ubepsa px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                      Subscribe to Updates
                   </Link>
                   <Link to="/about" className="btn-modern bg-transparent border-2 border-white/30 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                      Contact Us
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </section>

      <ArticleModal article={open} onClose={() => setOpen(null)} />
    </div>
  );
}

function ActionCard({ to, title, desc, icon }: { to: string, title: string, desc: string, icon: string }) {
   return (
      <Link to={to} className="group p-6 sm:p-8 lg:p-10 bg-white border border-slate-100 rounded-2xl sm:rounded-[2.5rem] shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10 hover:-translate-y-2 hover:border-ubepsa flex flex-col h-full">
         <div className="h-10 w-10 sm:h-16 sm:w-16 bg-blue-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-ubepsa font-black text-base sm:text-xl mb-6 sm:mb-8 group-hover:bg-ubepsa group-hover:text-white transition-all duration-300 shadow-sm">
            {icon}
         </div>
         <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-2 sm:mb-4 group-hover:text-ubepsa transition-colors leading-tight">{title}</h3>
         <p className="text-slate-500 font-medium leading-relaxed text-sm mb-6 flex-1">{desc}</p>
         <div className="flex items-center gap-2 text-ubepsa font-black text-[10px] sm:text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            <span>Learn More</span>
            <span>→</span>
         </div>
      </Link>
   );
}
