import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/about")({ component: AboutPage });

const TEAM = [
  { name: "Abians Phebe Chiamaka", role: "Editor in Chief", img: "/ed1.jpg" },
  { name: "Ismail Adebayo Mutholib", role: "Editorial Secretary", img: "/ed2.jpg" },
  { name: "Odiahi Marietta", role: "Senior Editor", img: "/ed3.jpg" },
];

function AboutPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-32">
      <div className="mb-12 sm:mb-20 border-b border-slate-100 pb-10">
        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-ubepsa text-[10px] font-black uppercase tracking-[0.2em] mb-4">
          Association Profile
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-tight">About & Contact.</h1>
        <p className="text-base sm:text-xl text-slate-500 mt-2 font-medium">Fostering excellence in physiotherapy at the University of Benin.</p>
      </div>

      <section className="grid lg:grid-cols-2 gap-12 sm:gap-20 mb-24 sm:mb-32">
        <div className="space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl font-black text-ubepsa leading-tight">Our Mission</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg font-medium">
            <p>
              
UBEPSA Editorial and Press is the official media and communications arm of the University of Benin Physiotherapy Students’ Association [UBEPSA]. As a non-profit organization, we are dedicated to informing, inspiring, and amplifying the voice of physiotherapy students.
              Keep the voice of physiotherapy students alive. We do this through storytelling, media coverage, and creative expression that inform, educate, and unite our community.
            </p>
            <p>
              Through our various platforms, we aim to provide valuable resources, foster a sense of community, and amplify the voices of our students both within the university and in the broader healthcare landscape.
            </p>
          </div>

           <h2 className="text-3xl sm:text-4xl font-black text-ubepsa leading-tight">What we do</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed text-base sm:text-lg font-medium">
            <p>
              
PhysioVibes Magazine is one of our flagship achievements, alongside other initiatives that spotlight student growth, achievements, and experiences. 

            </p>
            <p>
   We’re powered by a dedicated, passionate, and resilient team of physiotherapy students, supported by experienced physiotherapists and mentors. Together, we grow, explore, and thrive.
            </p>
          </div>

        </div>
        <div className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl sm:rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <h3 className="text-ubepsa-light font-black uppercase tracking-widest text-[10px] sm:text-xs mb-8">Official Channels</h3>
          <div className="space-y-4 text-slate-300 mb-12 relative z-10">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
               <p className="font-black text-white text-lg mb-1 leading-tight">Department of Physiotherapy</p>
               <p className="text-sm font-medium">Faculty of Basic Medical Sciences</p>
               <p className="text-sm font-medium">University of Benin, Nigeria</p>
            </div>
          </div>
          <div className="space-y-6 relative z-10 px-2">
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Support</p>
               <p className="text-lg font-bold truncate">ubepsaeditorial@gmail.com</p>
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Social Media</p>
               <p className="text-lg font-bold">@official_editorialpress</p>
            </div>
          </div>
          {/* Decorative glow */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-ubepsa/30 rounded-full blur-3xl group-hover:bg-ubepsa/50 transition-colors" />
        </div>
      </section>

      <section id="editorial" className="mb-24 sm:mb-32">
        <header className="mb-12 sm:mb-16">
           <div className="h-1 w-12 bg-ubepsa mb-6 rounded-full" />
           <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-tight">Editorial Board.</h2>
           <p className="text-base sm:text-xl text-slate-500 font-medium mt-2">The creative team behind our association's media,publications and website creation .</p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10">
          {TEAM.map(m => (
            <div key={m.name} className="group text-center">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 shadow-xl shadow-blue-900/5 transition-all group-hover:-translate-y-2 group-hover:shadow-blue-900/10">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>
              <div className="mt-6">
                 <h4 className="text-xl font-black text-slate-900 leading-tight">{m.name}</h4>
                 <p className="text-ubepsa font-bold text-xs uppercase tracking-widest mt-1.5">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 rounded-3xl sm:rounded-[3rem] p-8 sm:p-16 border border-slate-100 shadow-inner">
        <div className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 leading-tight">Write to the Editor</h2>
          <p className="text-base sm:text-lg text-slate-600 mb-10 font-medium">Have a story idea, professional inquiry, or feedback? We'd love to hear from you.</p>
          
          {sent ? (
            <div className="bg-white border-2 border-ubepsa p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 animate-in zoom-in-95 duration-500">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-ubepsa text-2xl mb-4">✓</div>
              <p className="text-2xl font-black text-slate-900 mb-2">Message Sent!</p>
              <p className="text-slate-500 font-medium">Thank you for reaching out. Our editorial team will get back to you within three working days.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                  <input required className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:outline-none transition-all font-medium" placeholder="Abians Phebe" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                  <input type="email" required className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:outline-none transition-all font-medium" placeholder="phebe@uniben.edu" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Your Message</label>
                <textarea required rows={5} className="w-full bg-white border-2 border-slate-100 rounded-2xl px-6 py-4 focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:outline-none transition-all font-medium resize-none" placeholder="Tell us what's on your mind..." />
              </div>
              <button className="bg-ubepsa text-white px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-lg hover:bg-ubepsa-dark transition-all shadow-xl shadow-blue-500/20 active:scale-95 self-start min-w-full sm:min-w-[200px]">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
