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
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="mb-16 border-b border-slate-100 pb-10">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">About & Contact.</h1>
        <p className="text-lg text-slate-500 mt-2 font-medium">Fostering excellence in physiotherapy at the University of Benin.</p>
      </div>

      <section className="grid lg:grid-cols-2 gap-20 mb-32">
        <div className="space-y-8">
          <h2 className="text-3xl font-black text-ubepsa">Our Mission</h2>
          <div className="space-y-6 text-slate-600 leading-relaxed text-lg font-medium">
            <p>
              UBEPSA (University of Benin Physiotherapy Students' Association) is the official body representing all students in the Department of Physiotherapy. Our mission is to promote academic excellence, professional development, and student welfare.
            </p>
            <p>
              Through our various platforms, we aim to provide valuable resources, foster a sense of community, and amplify the voices of our students both within the university and in the broader healthcare landscape.
            </p>
          </div>
        </div>
        <div className="bg-slate-900 text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <h3 className="text-ubepsa-light font-black uppercase tracking-widest text-xs mb-8">Official Channels</h3>
          <div className="space-y-2 text-slate-300 mb-12 relative z-10">
            <p className="font-bold text-white text-lg">Department of Physiotherapy</p>
            <p>Faculty of Basic Medical Sciences</p>
            <p>University of Benin, Nigeria</p>
          </div>
          <div className="space-y-4 relative z-10">
            <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Email Support</p>
               <p className="text-lg font-bold">ubepsaeditorial@gmail.com</p>
            </div>
            <div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Social Media</p>
               <p className="text-lg font-bold">@official_editorialpress</p>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-ubepsa/20 rounded-full blur-3xl" />
        </div>
      </section>

      <section className="mb-32">
        <header className="mb-16">
           <div className="h-1 w-12 bg-ubepsa mb-6" />
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Editorial Board.</h2>
           <p className="text-slate-500 font-medium mt-2">The creative team behind our association's media and publications.</p>
        </header>
        
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-10">
          {TEAM.map(m => (
            <div key={m.name} className="group">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-slate-50 border border-slate-100 shadow-xl shadow-blue-900/5 transition-all group-hover:-translate-y-2 group-hover:shadow-blue-900/10">
                <img src={m.img} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="mt-6 text-center">
                 <h4 className="text-xl font-black text-slate-900">{m.name}</h4>
                 <p className="text-ubepsa font-bold text-xs uppercase tracking-widest mt-1">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-100">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-blue-900 mb-4">Write to the Editor</h2>
          <p className="text-slate-600 mb-10">Have a story idea or feedback? We'd love to hear from you.</p>
          
          {sent ? (
            <div className="bg-white border-2 border-blue-600 p-8 rounded-2xl shadow-sm">
              <p className="text-2xl font-bold text-blue-900 mb-2">Message Sent!</p>
              <p className="text-slate-600">Thank you for reaching out. We'll get back to you within three working days.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid gap-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-900">Full Name</label>
                  <input required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-blue-900">Email Address</label>
                  <input type="email" required className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all" placeholder="john@uniben.edu" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-blue-900">Message</label>
                <textarea required rows={5} className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 focus:outline-none transition-all" placeholder="Tell us what's on your mind..." />
              </div>
              <button className="bg-blue-600 text-white px-10 py-4 rounded-lg font-bold hover:bg-blue-700 transition-shadow shadow-md self-start">
                Send Message
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}


function Input({ label, className = "", ...rest }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div className={className}>
      <label className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1">{label}</label>
      <input {...rest} className="w-full bg-cream border border-ink/30 px-3 py-2 font-serif focus:outline-none focus:border-press-red" />
    </div>
  );
}
