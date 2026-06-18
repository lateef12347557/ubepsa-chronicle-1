import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/excos')({
  component: MeetYourExcosPage,
});

const EXCOS = [
  { id: 1, name: 'Executive Name', role: 'President', img: '/exco1.jfif' },
  { id: 2, name: 'Executive Name', role: 'Vice President', img: '/exco2.jfif' },
  { id: 3, name: 'Executive Name', role: 'General Secretary', img: '/exco3.jfif' },
  { id: 4, name: 'Executive Name', role: 'Treasurer', img: '/exco4.jfif' },
];

function MeetYourExcosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <header className="mb-12 sm:mb-20 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
          The Leadership Team
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">
          Meet Your <span className="text-ubepsa">Executives.</span>
        </h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
          The dedicated individuals working tirelessly to serve the UBEPSA community and advance our profession.
        </p>
      </header>
      
      <div className="grid gap-6 sm:gap-10 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4">
        {EXCOS.map((exco) => (
          <div key={exco.id} className="group">
            <div className="aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-xl shadow-blue-900/5 border border-slate-100 mb-4 sm:mb-6 transition-all group-hover:-translate-y-2 group-hover:shadow-blue-900/10">
              <img 
                src={exco.img} 
                alt={exco.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <div className="text-center px-2">
               <h3 className="text-lg sm:text-2xl font-black text-slate-900 mb-1 leading-tight">{exco.name}</h3>
               <p className="text-ubepsa font-bold text-[10px] sm:text-xs uppercase tracking-widest">{exco.role}</p>
            </div>
          </div>
        ))}
      </div>
      
      <section className="mt-20 sm:mt-32 p-8 sm:p-16 rounded-3xl sm:rounded-[4rem] bg-ubepsa text-white relative overflow-hidden shadow-2xl shadow-blue-500/20">
         <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 leading-tight">Dedicated to Service</h2>
            <p className="text-blue-50 text-base sm:text-xl font-medium leading-relaxed">
              Our executive council is elected to represent your voice, protect your interests, and create opportunities for every physiotherapy student at the University of Benin.
            </p>
            <div className="mt-10 flex justify-center">
               <div className="h-1.5 w-12 bg-white/20 rounded-full" />
            </div>
         </div>
         {/* Decorative elements */}
         <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-48 sm:w-64 h-48 sm:h-64 bg-blue-400/20 rounded-full blur-2xl" />
      </section>
    </div>
  );
}
