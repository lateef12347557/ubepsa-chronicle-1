import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/about")({ component: AboutPage });

const TEAM = [
  { name: "Adaeze Okonkwo", role: "Editor-in-Chief", seed: "ed1" },
  { name: "Tunde Adebayo", role: "Features Editor", seed: "ed2" },
  { name: "Ifeoma Bello", role: "Opinion Editor", seed: "ed3" },
  { name: "Zara Mohammed", role: "Lead Photographer", seed: "ed4" },
  { name: "Kelechi Umeh", role: "Sports Editor", seed: "ed5" },
  { name: "Emeka Igwe", role: "News Desk Lead", seed: "ed6" },
];

function AboutPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="page-fade max-w-6xl mx-auto px-4 py-12">
      <div className="rule-double py-3 mb-10">
        <h1 className="font-display font-black text-4xl sm:text-5xl">About & Contact</h1>
        <p className="font-serif italic text-ink/70 mt-1">Who we are. Where to find us. How to write to us.</p>
      </div>

      <section className="grid lg:grid-cols-2 gap-10 mb-16">
        <div>
          <h2 className="font-display font-black text-3xl text-ink">Our Mission</h2>
          <p className="mt-4 font-serif text-ink/85 leading-[1.8] dropcap">
            UBEPSA exists to chronicle the life of the University of Benin with rigour, fairness, and uncompromising independence. We have been the student press at UNIBEN since 1979 — through reform and protest, through silence and song, through every Vice-Chancellor since the year of our founding.
          </p>
          <p className="mt-4 font-serif text-ink/85 leading-[1.8]">
            We publish reportage, opinion, photography and official press releases. We train the next generation of Nigerian journalists. We hold our institution to the standards it sets for us.
          </p>
          <blockquote className="pull-quote">A free press is a free people.</blockquote>
        </div>
        <div className="bg-ink text-cream p-8">
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold">Visit the Newsroom</h3>
          <div className="mt-4 font-serif space-y-2">
            <p>UBEPSA Editorial Office</p>
            <p>Room 14, Student Union Building</p>
            <p>University of Benin, Ugbowo Campus</p>
            <p>Benin City, Edo State, Nigeria</p>
          </div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold mt-8">Hours</h3>
          <p className="mt-2 font-serif">Mon – Fri · 10:00 – 18:00</p>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold mt-8">Contact</h3>
          <p className="mt-2 font-serif">press@ubepsa.uniben.edu</p>
          <p className="font-serif">@ubepsa_uniben</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display font-black text-3xl mb-6">Editorial Board</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {TEAM.map(m => (
            <div key={m.seed} className="bg-card p-5 lift">
              <img src={`https://picsum.photos/seed/${m.seed}/600/600`} alt={m.name} className="w-full aspect-square object-cover grayscale" />
              <h4 className="font-display font-bold text-lg mt-3 text-ink">{m.name}</h4>
              <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-press-red mt-1">{m.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display font-black text-3xl mb-6">Write to the Editor</h2>
        {sent ? (
          <div className="bg-card border-l-4 border-press-red p-6 font-serif">
            <p className="font-display font-bold text-xl text-ink">Thank you.</p>
            <p className="text-ink/80 mt-1">Your message has been received by the editorial desk. We respond within three working days.</p>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="grid sm:grid-cols-2 gap-4 bg-card p-6 border border-ink/15">
            <Input label="Name" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <Input label="Subject" name="subject" required className="sm:col-span-2" />
            <div className="sm:col-span-2">
              <label className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1">Message</label>
              <textarea required rows={6} className="w-full bg-cream border border-ink/30 px-3 py-2 font-serif focus:outline-none focus:border-press-red" />
            </div>
            <button className="sm:col-span-2 justify-self-start font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-6 py-3 hover:bg-press-red transition-colors">
              Send to Editor →
            </button>
          </form>
        )}
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
