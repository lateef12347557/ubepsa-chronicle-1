import { createFileRoute } from '@tanstack/react-router';
import { useUbepsa } from '@/components/ubepsa/UbepsaProvider';

export const Route = createFileRoute('/scholarship')({
  component: ScholarshipPage,
});

function ScholarshipPage() {
  const { scholarships } = useUbepsa();

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <header className="mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-6">
          Student Support
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter mb-6">Empowering <span className="text-ubepsa">Success.</span></h1>
        <p className="text-lg text-slate-500 max-w-2xl font-medium">Access information on academic grants and financial support available for Physiotherapy students.</p>
      </header>
      
      {scholarships.length > 0 ? (
        <div className="space-y-12">
          {scholarships.map((s) => (
            <div key={s.id} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-blue-900/5 transition-all hover:shadow-blue-900/10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="max-w-3xl">
                  <h2 className="text-3xl font-black text-slate-900 mb-4">{s.title}</h2>
                  <div className="mb-6">
                    <p className="text-xs font-black text-ubepsa uppercase tracking-widest mb-2">Eligibility</p>
                    <p className="text-slate-600 font-medium">{s.eligibility}</p>
                  </div>
                  <p className="text-slate-500 leading-relaxed font-medium text-lg mb-8">{s.description}</p>
                  {s.link && (
                    <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-ubepsa text-white px-8 py-4 rounded-2xl font-black hover:bg-ubepsa-dark transition-all">
                      Apply Now <span>→</span>
                    </a>
                  )}
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 min-w-[200px] text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Deadline</p>
                  <p className="text-xl font-black text-slate-900">{s.deadline || "Open"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-ubepsa rounded-[3rem] p-12 text-white relative overflow-hidden group">
          <div className="max-w-3xl relative z-10">
            <h2 className="text-4xl font-black mb-8">Undergraduate Grant Program</h2>
            <p className="text-blue-50 text-lg font-medium mb-12 leading-relaxed">
              UBEPSA is committed to supporting students who demonstrate academic excellence and leadership potential. Check back regularly for new scholarship opportunities.
            </p>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
        </div>
      )}
    </div>
  );
}
