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
    <div className="max-w-7xl mx-auto px-6 py-24">
      <header className="mb-16 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          The Leadership Team
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-6">
          Meet Your <span className="text-ubepsa">Executives.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
          The dedicated individuals working tirelessly to serve the UBEPSA community.
        </p>
      </header>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {EXCOS.map((exco) => (
          <div key={exco.id} className="group">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-lg shadow-blue-900/5 border border-slate-100 mb-6 transition-all group-hover:-translate-y-2">
              <img 
                src={exco.img} 
                alt={exco.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
            </div>
            <div className="text-center">
               <h3 className="text-xl font-black text-slate-900 mb-1">{exco.name}</h3>
               <p className="text-ubepsa font-bold text-xs uppercase tracking-widest">{exco.role}</p>
            </div>
          </div>
        ))}
      </div>
      
      <section className="mt-32 p-12 rounded-[3rem] bg-ubepsa text-white relative overflow-hidden">
         <div className="relative z-10 text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-black mb-6">Dedicated to Service</h2>
            <p className="text-blue-100 text-lg font-medium leading-relaxed">
              Our executive council is elected to represent your voice, protect your interests, and create opportunities for every physiotherapy student at the University of Benin.
            </p>
         </div>
         <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
         <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl" />
      </section>
    </div>
  );
}
