import { createFileRoute } from '@tanstack/react-router';
import { useUbepsa } from '@/components/ubepsa/UbepsaProvider';

export const Route = createFileRoute('/scholarship')({
  component: ScholarshipPage,
});

function ScholarshipPage() {
  const { scholarships } = useUbepsa();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <header className="mb-12 sm:mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4 sm:mb-6">
          Student Support
        </div>
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter mb-4 sm:mb-6 leading-tight">Empowering <span className="text-ubepsa">Success.</span></h1>
        <p className="text-base sm:text-xl text-slate-500 max-w-2xl font-medium leading-relaxed">Access information on academic grants and financial support available for Physiotherapy students at UNIBEN.</p>
      </header>
      
      {scholarships.length > 0 ? (
        <div className="space-y-8 sm:space-y-12">
          {scholarships.map((s) => (
            <div key={s.id} className="bg-white rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 border border-slate-100 shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 sm:gap-10">
                <div className="max-w-3xl flex-1">
                  <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">{s.title}</h2>
                  <div className="mb-6">
                    <p className="text-[10px] sm:text-xs font-black text-ubepsa uppercase tracking-widest mb-2">Eligibility</p>
                    <p className="text-sm sm:text-lg text-slate-600 font-medium leading-relaxed">{s.eligibility}</p>
                  </div>
                  <p className="text-slate-500 leading-relaxed font-medium text-sm sm:text-lg mb-8">{s.description}</p>
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-ubepsa text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base hover:bg-ubepsa-dark transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                      Apply Now <span>→</span>
                    </a>
                  )}
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-full sm:min-w-[240px] text-center lg:text-left">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-900">{s.deadline || "Open"}</p>
                  <div className="mt-4 h-1 w-8 bg-ubepsa/20 rounded-full mx-auto lg:mx-0" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-ubepsa rounded-3xl sm:rounded-[3rem] p-8 sm:p-16 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/20">
          <div className="max-w-3xl relative z-10">
            <h2 className="text-3xl sm:text-5xl font-black mb-6 sm:mb-8 leading-tight">Scholarship Program</h2>
            <p className="text-blue-50 text-base sm:text-xl font-medium mb-12 leading-relaxed">
              UBEPSA is committed to supporting students who demonstrate academic excellence and leadership potential. Check back regularly for new scholarship opportunities and grants.
            </p>
            <div className="h-1.5 w-12 bg-white/20 rounded-full" />
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-white/10 rounded-full blur-[100px]" />
        </div>
      )}
    </div>
  );
}
