import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/scholarship')({
  component: ScholarshipPage,
});

function ScholarshipPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <header className="mb-20">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-xs font-black uppercase tracking-[0.2em] mb-6">
          Student Support
        </div>
        <h1 className="text-5xl sm:text-8xl font-black text-slate-900 tracking-tighter mb-8">Empowering <span className="text-ubepsa">Success.</span></h1>
        <p className="text-xl text-slate-500 max-w-2xl font-medium">Access information on academic grants and financial support available for Physiotherapy students.</p>
      </header>
      
      <div className="bg-ubepsa rounded-[3rem] p-12 text-white relative overflow-hidden group">
        <div className="max-w-3xl relative z-10">
          <h2 className="text-4xl font-black mb-8">Undergraduate Grant Program</h2>
          <p className="text-blue-50 text-lg font-medium mb-12 leading-relaxed">
            UBEPSA is committed to supporting students who demonstrate academic excellence and leadership potential. Our grant program is designed to alleviate financial burdens and encourage focused study.
          </p>
          <button className="bg-white text-ubepsa px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-95">
            Check Eligibility
          </button>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-96 h-96 bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
      </div>
      
      <div className="mt-20 grid gap-8 md:grid-cols-2">
         <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Federal Grants</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Regularly updated list of national scholarships relevant to healthcare students.</p>
         </div>
         <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Research Funding</h3>
            <p className="text-slate-500 font-medium leading-relaxed">Support for final year projects and innovative physiotherapy research initiatives.</p>
         </div>
      </div>
    </div>
  );
}
