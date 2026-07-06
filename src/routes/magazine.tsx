import { createFileRoute, Link } from "@tanstack/react-router";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { type Magazine, type PageContent } from "@/lib/ubepsa-store";
import { useState } from "react";
import { 
  BookOpen, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Sparkles, 
  Layers, 
  Clock, 
  Award,
  ChevronDown
} from "lucide-react";

export const Route = createFileRoute("/magazine")({ component: MagazinePage });

function MagazinePage() {
  const { magazines } = useUbepsa();
  const [selectedIssue, setSelectedIssue] = useState<Magazine | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // Handle opening the online reader
  const startReading = (issue: Magazine) => {
    setSelectedIssue(issue);
    setCurrentPage(0);
  };

  const handleNextPage = () => {
    if (!selectedIssue) return;
    if (currentPage < selectedIssue.pages.length + 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const sortedEditions = [...magazines].sort((a, b) => {
    return sortBy === "newest" ? b.volume - a.volume : a.volume - b.volume;
  });

  const latestEdition = magazines[0];

  return (
    <div className="bg-slate-50/50 min-h-screen selection:bg-ubepsa selection:text-white">
      {/* ============ HEADER ============ */}
      <div className="relative overflow-hidden bg-white border-b border-slate-100 pt-24 pb-16">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 to-violet-50/30 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-ubepsa text-xs font-black uppercase tracking-[0.2em] mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>UBEPSA Publications</span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                PhysioVibes <span className="text-ubepsa">Magazine.</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-500 font-medium leading-relaxed">
                The flagship publication of the University of Benin Physiotherapy Students' Association, highlighting scientific breakthroughs, clinical guides, and student life.
              </p>
            </div>
            
            {/* Filter/Sort controls */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Sort by</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "newest" | "oldest")}
                  className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-xs font-bold text-slate-600 focus:outline-none focus:border-ubepsa focus:ring-4 focus:ring-blue-50/50 cursor-pointer shadow-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MAGAZINE CONTENT AREA ============ */}
      {magazines.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="py-20 sm:py-32 text-center border border-slate-200 rounded-[2.5rem] bg-white shadow-xl shadow-slate-900/5">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-blue-50 text-ubepsa mb-6">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Magazines Published</h3>
            <p className="text-slate-500 font-medium max-w-sm mx-auto text-sm leading-relaxed">
              There are currently no magazine editions published in the database. Please check back later or log in to the staff portal to upload a new edition.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ============ FEATURED / LATEST ISSUE SPOTLIGHT ============ */}
          {sortBy === "newest" && latestEdition && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16">
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-900/5 p-6 sm:p-12 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center relative z-10">
                  {/* Left Details */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-3">
                      <span className="bg-ubepsa text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-md shadow-blue-500/10">
                        Latest Issue
                      </span>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Volume {latestEdition.volume} · Issue {latestEdition.issue}
                      </span>
                    </div>
                    
                    <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                      {latestEdition.subtitle}
                    </h2>
                    
                    <p className="text-slate-500 text-sm sm:text-lg leading-relaxed font-medium">
                      {latestEdition.description}
                    </p>

                    {/* Inside this issue list */}
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/85">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Layers className="h-4 w-4 text-ubepsa" />
                        <span>Featured in this Volume</span>
                      </h3>
                      <ul className="grid sm:grid-cols-2 gap-3.5">
                        {latestEdition.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-600">
                            <div className="h-2 w-2 rounded-full bg-ubepsa shrink-0" />
                            <span className="line-clamp-1">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button 
                        onClick={() => startReading(latestEdition)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 bg-ubepsa text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-ubepsa-dark transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4" />
                        Read Issue Online
                      </button>
                      {latestEdition.pdfUrl && (
                        <a 
                          href={latestEdition.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2.5 bg-white text-slate-700 border-2 border-slate-100 px-8 py-4 rounded-xl font-black text-sm hover:border-ubepsa hover:text-ubepsa transition-all shadow-sm active:scale-95"
                        >
                          <Download className="h-4 w-4 text-slate-400" />
                          Download PDF ({latestEdition.pdfSize})
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right Cover Preview */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl shadow-[0_20px_50px_rgba(9,30,66,0.15)] overflow-hidden transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_30px_60px_rgba(9,30,66,0.22)] select-none">
                      {/* Magazine Design Cover */}
                      <div className={`w-full h-full bg-gradient-to-br ${latestEdition.bgGradient} p-8 flex flex-col justify-between text-white relative`}>
                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 mix-blend-overlay pointer-events-none" />
                        <div className="absolute inset-0 bg-white/[0.02] bg-[linear-gradient(45deg,_transparent_45%,_#fff_45%,_#fff_55%,_transparent_55%)] bg-[length:10px_10px] pointer-events-none" />
                        
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-12 h-12 bg-white rounded-xl p-1.5 shadow-md border border-white/20 mb-4">
                            <img src="/logo.jfif" alt="" className="h-full w-full object-contain" />
                          </div>
                          <p className="text-[8px] font-black uppercase tracking-[0.4em] text-white/70 mb-1 leading-none">Official Publication</p>
                          <h3 className="text-3xl font-black tracking-tighter uppercase leading-none font-display text-center">
                            PHYSIO<span className="opacity-80">VIBES</span>
                          </h3>
                          <div className="w-8 h-[2px] bg-white/40 my-3" />
                          <p className="text-[7px] font-black uppercase tracking-widest text-center text-white/80">University of Benin</p>
                        </div>

                        <div className="relative z-10 space-y-4">
                          <div className="space-y-1">
                            <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded border border-white/10">
                              Vol. {latestEdition.volume} · Issue {latestEdition.issue}
                            </span>
                            <h4 className="text-2xl font-black leading-tight tracking-tight mt-1.5">
                              {latestEdition.title}
                            </h4>
                            <p className="text-[9px] font-bold text-white/80 leading-snug">
                              {latestEdition.subtitle}
                            </p>
                          </div>

                          <div className="border-t border-white/20 pt-3">
                            <p className="text-[6px] font-bold uppercase tracking-wider text-white/50 mb-1.5">In this issue:</p>
                            <div className="space-y-1">
                              {latestEdition.features.slice(0, 2).map((feat, idx) => (
                                <p key={idx} className="text-[7px] font-black text-white/85 flex items-center gap-1.5 leading-none">
                                  <span className="h-1 w-1 bg-white/60 rounded-full" />
                                  <span className="line-clamp-1">{feat}</span>
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-3 text-[7px] font-black text-white/60 uppercase tracking-widest">
                          <span>{latestEdition.date}</span>
                          <span>UBEPSA Editorial</span>
                        </div>
                      </div>
                      {/* Gloss Effect */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============ EDITIONS GRID ============ */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="border-b border-slate-200/80 pb-6 mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  All Volumes
                </h2>
                <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
                  Explore the historical archive of UBEPSA's official publications.
                </p>
              </div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full border border-slate-200/50">
                {sortedEditions.length} Issues Available
              </span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {sortedEditions.map((edition) => {
                const isLatest = edition.volume === latestEdition.volume;
                return (
                  <div 
                    key={edition.id} 
                    className="bg-white rounded-3xl border border-slate-100 shadow-md shadow-slate-900/5 overflow-hidden transition-all hover:shadow-xl hover:border-slate-200/85 hover:-translate-y-1.5 flex flex-col group"
                  >
                    {/* Visual Cover Header */}
                    <div className="aspect-[4/3] bg-slate-950 overflow-hidden relative select-none">
                      <div className={`absolute inset-0 bg-gradient-to-br ${edition.bgGradient} p-6 flex flex-col justify-between text-white`}>
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 mix-blend-overlay" />
                        
                        <div className="flex justify-between items-start">
                          <div className="w-8 h-8 bg-white rounded-lg p-1 shadow-md">
                            <img src="/logo.jfif" alt="" className="h-full w-full object-contain" />
                          </div>
                          <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded border border-white/10">
                            Vol. {edition.volume}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-lg font-black tracking-tight leading-tight uppercase font-display">
                            PHYSIOVIBES
                          </h4>
                          <p className="text-[9px] font-black uppercase tracking-wider text-white/80 leading-none">
                            {edition.subtitle}
                          </p>
                        </div>

                        <div className="flex justify-between items-end text-[7px] font-bold text-white/60 border-t border-white/10 pt-2 uppercase tracking-widest">
                          <span>{edition.date}</span>
                          <span>Issue {edition.issue}</span>
                        </div>
                      </div>
                      
                      {/* Hover Sheen */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    </div>

                    {/* Details Footer */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-black text-slate-900 leading-tight">
                            {edition.title}
                          </h3>
                          {isLatest && (
                            <span className="bg-blue-50 text-ubepsa text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border border-blue-100">
                              Current
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed line-clamp-3">
                          {edition.description}
                        </p>
                      </div>

                      <div className="border-t border-slate-100 pt-4 space-y-4">
                        {/* Action buttons */}
                        <div className="flex gap-3">
                          <button 
                            onClick={() => startReading(edition)}
                            className="flex-1 py-3 bg-slate-50 hover:bg-ubepsa hover:text-white rounded-xl text-slate-700 font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 cursor-pointer text-center flex items-center justify-center gap-1.5"
                          >
                            <BookOpen className="h-3.5 w-3.5" />
                            Read Online
                          </button>
                          {edition.pdfUrl && (
                            <a 
                              href={edition.pdfUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-ubepsa transition-all active:scale-95 flex items-center justify-center"
                              title={`Download PDF (${edition.pdfSize})`}
                            >
                              <Download className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ============ SUBMIT / CALL FOR PAPERS SECTION ============ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-16 relative overflow-hidden shadow-xl shadow-slate-900/10">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-white/5 border border-white/10 text-blue-400">
              <Award className="h-6 w-6" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Contribute to PhysioVibes
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-medium">
                Are you working on an interesting clinical case? Or do you have thoughts on the future of physical therapy? We are constantly looking for writers, research reviews, student experiences, and artistic contributions.
              </p>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 text-left max-w-lg mx-auto">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 text-center">
                Next Submission Deadline
              </h3>
              <div className="flex justify-between items-center text-xs sm:text-sm font-bold">
                <span className="text-white">Volume 11 / Issue 1</span>
                <span className="text-blue-300">September 30, 2026</span>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <a 
                href="mailto:ubepsaeditorial@gmail.com?subject=PhysioVibes Submission Proposal"
                className="bg-white text-slate-900 hover:bg-blue-50 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-lg active:scale-95"
              >
                Submit Pitch Proposal
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ============ INTERACTIVE PAGE FLIP READER MODAL ============ */}
      {selectedIssue && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-md overflow-hidden flex flex-col justify-between select-none">
          {/* Modal Header */}
          <header className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white relative z-10">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500 px-2 py-0.5 rounded leading-none">
                VOL. {selectedIssue.volume}
              </span>
              <h2 className="text-sm sm:text-base font-black tracking-tight line-clamp-1">
                {selectedIssue.title}
              </h2>
            </div>
            
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">
                {selectedIssue.date}
              </span>
              <button 
                onClick={() => setSelectedIssue(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                Exit Reader
              </button>
            </div>
          </header>

          {/* Reader Canvas */}
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
            {currentPage === 0 ? (
              /* COVER PAGE */
              <div className="max-w-[400px] w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-slate-800/50 animate-in zoom-in-95 duration-300">
                <div className={`w-full h-full bg-gradient-to-br ${selectedIssue.bgGradient} p-8 flex flex-col justify-between text-white relative`}>
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 mix-blend-overlay" />
                  
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-14 h-14 bg-white rounded-2xl p-1.5 shadow-md border border-white/20 mb-4">
                      <img src="/logo.jfif" alt="" className="h-full w-full object-contain" />
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70 mb-1 leading-none">Official Publication</p>
                    <h3 className="text-4xl font-black tracking-tighter uppercase leading-none font-display text-center">
                      PHYSIO<span className="opacity-80">VIBES</span>
                    </h3>
                    <div className="w-10 h-[2px] bg-white/40 my-3" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-center text-white/80">University of Benin</p>
                  </div>

                  <div className="relative z-10 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[7px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded border border-white/10">
                        Vol. {selectedIssue.volume} · Issue {selectedIssue.issue}
                      </span>
                      <h4 className="text-3xl font-black leading-tight tracking-tight mt-2">
                        {selectedIssue.title}
                      </h4>
                      <p className="text-xs font-bold text-white/80 leading-snug">
                        {selectedIssue.subtitle}
                      </p>
                    </div>

                    <div className="border-t border-white/20 pt-4">
                      <p className="text-[8px] font-bold uppercase tracking-wider text-white/50 mb-2">Inside this issue:</p>
                      <div className="space-y-1.5">
                        {selectedIssue.features.map((feat, idx) => (
                          <p key={idx} className="text-[9px] font-black text-white/85 flex items-center gap-2 leading-none">
                            <span className="h-1 w-1 bg-white/60 rounded-full shrink-0" />
                            <span className="line-clamp-1">{feat}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-3 text-[8px] font-black text-white/60 uppercase tracking-widest">
                    <span>{selectedIssue.date}</span>
                    <span>UBEPSA Editorial</span>
                  </div>
                </div>
              </div>
            ) : currentPage <= selectedIssue.pages.length ? (
              /* EDITORIAL / ARTICLE / INTERVIEW PAGE */
              <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row h-full max-h-[600px] border border-slate-200 animate-in fade-in duration-300">
                {/* Left Column (Left Page) */}
                <div className="flex-1 p-6 sm:p-10 border-r border-slate-100 flex flex-col justify-between overflow-y-auto">
                  <div>
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6">
                      <span className="text-[8px] font-black text-ubepsa uppercase tracking-widest">
                        {selectedIssue.pages[currentPage - 1].type}
                      </span>
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        PhysioVibes Vol. {selectedIssue.volume}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-2">
                      {selectedIssue.pages[currentPage - 1].title}
                    </h3>
                    
                    {selectedIssue.pages[currentPage - 1].subtitle && (
                      <p className="text-xs sm:text-sm font-bold text-slate-500 italic mb-6">
                        {selectedIssue.pages[currentPage - 1].subtitle}
                      </p>
                    )}

                    <div className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed space-y-4">
                      {selectedIssue.pages[currentPage - 1].columns[0]?.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </div>

                  {selectedIssue.pages[currentPage - 1].author && (
                    <div className="border-t border-slate-50 pt-4 mt-6">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contributed By</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">{selectedIssue.pages[currentPage - 1].author}</p>
                    </div>
                  )}
                </div>

                {/* Right Column (Right Page) */}
                <div className="flex-1 p-6 sm:p-10 bg-slate-50/50 flex flex-col justify-between overflow-y-auto">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                      <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                        Interactive Preview
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        Page {(currentPage * 2) - 1} · {currentPage * 2}
                      </span>
                    </div>

                    <div className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed space-y-4">
                      {selectedIssue.pages[currentPage - 1].columns[1]?.map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>

                    {selectedIssue.pages[currentPage - 1].quote && (
                      <div className="border-l-4 border-ubepsa pl-4 py-2 bg-blue-50/30 rounded-r-xl">
                        <p className="text-xs sm:text-sm font-black text-slate-800 leading-relaxed">
                          "{selectedIssue.pages[currentPage - 1].quote}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    <span>UBEPSA Press</span>
                    <span>Page {currentPage} of {selectedIssue.pages.length}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* BACK COVER */
              <div className="max-w-[400px] w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-slate-800/50 animate-in zoom-in-95 duration-300">
                <div className="w-full h-full bg-slate-900 p-8 flex flex-col justify-between text-white text-center items-center relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 mix-blend-overlay pointer-events-none" />
                  
                  <div className="my-auto space-y-8 relative z-10">
                    <div className="inline-block p-4 rounded-3xl bg-white/5 border border-white/10 shadow-lg">
                      <img src="/logo.jfif" alt="" className="h-16 w-16 object-contain" />
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black tracking-widest uppercase font-display leading-none">
                        PHYSIOVIBES
                      </h4>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        Official Voice of UBEPSA
                      </p>
                    </div>

                    <div className="w-12 h-0.5 bg-white/20 mx-auto" />

                    <p className="text-xs font-bold text-slate-300 max-w-xs leading-relaxed italic mx-auto">
                      "Fostering Academic & Professional Growth, Clinical Competence, and Scientific Rigor."
                    </p>
                  </div>

                  <div className="w-full border-t border-white/10 pt-6 relative z-10 flex flex-col gap-2">
                    <div className="flex justify-center gap-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <a href="#" className="hover:text-white transition-colors">Instagram</a>
                      <a href="#" className="hover:text-white transition-colors">Twitter</a>
                      <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                    </div>
                    <p className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">
                      © {new Date().getFullYear()} UBEPSA Editorial Committee. All rights reserved.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reader Navigation Footer */}
          <footer className="px-6 py-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-white relative z-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Prev Page
            </button>

            {/* Pagination details */}
            <div className="text-xs font-bold text-slate-400">
              {currentPage === 0 ? "Front Cover" : currentPage > selectedIssue.pages.length ? "Back Cover" : `Preview Page ${currentPage} of ${selectedIssue.pages.length}`}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage > selectedIssue.pages.length}
              className="flex items-center gap-2 px-5 py-3 bg-ubepsa hover:bg-ubepsa-dark disabled:opacity-30 disabled:pointer-events-none rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-blue-500/10"
            >
              Next Page
              <ChevronRight className="h-4 w-4" />
            </button>
          </footer>
        </div>
      )}
    </div>
  );
}
