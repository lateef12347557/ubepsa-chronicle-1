import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/about")({ component: AboutPage });

const TEAM = [
  { name: "Abians Phebe Chiamaka", role: "Editor-in-Chief", img: "/IMG-20260511-WA0095.jpg" },
  { name: "Ismail Adebayo Mutholib", role: "Editorial Secretary", img: "/IMG-20260511-WA0095.jpg" },
  { name: "Odiahi Marietta", role: "Senior Editor", img: "/IMG-20260511-WA0095.jpg" },
  { name: "Zara Mohammed", role: "Lead Photographer", img: "/team-ed4.jpg" },
  { name: "Kelechi Umeh", role: "Sports Editor", img: "/team-ed5.jpg" },
  { name: "Emeka Igwe", role: "News Desk Lead", img: "/team-ed6.jpg" },
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
          <h2 className="font-display font-black text-3xl text-ink">Who We Are</h2>
          <p className="mt-4 font-serif text-ink/85 leading-[1.8] dropcap">
            UBEPSA Editorial and Press is the official media and communications arm of the University of Benin Physiotherapy Students' Association [UBEPSA]. As a non-profit organization, we are dedicated to informing, inspiring, and amplifying the voice of physiotherapy students.
          </p>
          <h3 className="font-display font-bold text-xl mt-6 text-ink">Our Mission</h3>
          <p className="mt-2 font-serif text-ink/85 leading-[1.8]">
            Keep the voice of physiotherapy students alive. We do this through storytelling, media coverage, and creative expression that inform, educate, and unite our community.
          </p>
          <h3 className="font-display font-bold text-xl mt-6 text-ink">What We Do</h3>
          <p className="mt-2 font-serif text-ink/85 leading-[1.8]">
            PhysioVibes Magazine is one of our flagship achievements, alongside other initiatives that spotlight student growth, achievements, and experiences.
          </p>
          <p className="mt-4 font-serif text-ink/85 leading-[1.8]">
            We're powered by a dedicated, passionate, and resilient team of physiotherapy students, supported by experienced physiotherapists and mentors. Together, we grow, explore, and thrive.
          </p>
        </div>
        <div className="bg-ink text-cream p-8">
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold">Visit the Newsroom</h3>
          <div className="mt-4 font-serif space-y-2">
            <p>Department of Physiotherapy</p>
            <p>University of Benin</p>
            <p>Benin City, Edo State, Nigeria</p>
          </div>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold mt-8">Contact</h3>
          <p className="mt-2 font-serif">ubepsaeditorial@gmail.com</p>
          <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-gold font-bold mt-8">Instagram</h3>
          <p className="mt-2 font-serif">@official_editorialpress</p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-display font-black text-3xl mb-6">Editorial Board</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {TEAM.map(m => (
            <div key={m.img} className="bg-card p-5 lift">
              <div className="w-full aspect-square overflow-hidden bg-ink/10">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover grayscale"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${m.name}/600/600`;
                  }}
                />
              </div>
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
