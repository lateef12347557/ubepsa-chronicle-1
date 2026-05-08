import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { CATEGORIES } from "@/lib/ubepsa-store";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const ADMIN_PASSWORD = "ubepsa2024";

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");

  if (!authed) {
    return (
      <div className="page-fade max-w-md mx-auto px-4 py-20">
        <div className="rule-double py-3 mb-6 text-center">
          <h1 className="font-display font-black text-3xl">Editorial CMS</h1>
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/60 mt-1">Restricted · UBEPSA Staff Only</p>
        </div>
        <form
          onSubmit={(e) => { e.preventDefault(); if (pwd === ADMIN_PASSWORD) setAuthed(true); else setErr("Incorrect password."); }}
          className="bg-card p-6 border border-ink/20"
        >
          <label className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1">Password</label>
          <input
            type="password"
            value={pwd}
            onChange={(e) => { setPwd(e.target.value); setErr(""); }}
            className="w-full bg-cream border border-ink/30 px-3 py-2 font-mono focus:outline-none focus:border-press-red"
            autoFocus
          />
          {err && <p className="text-press-red font-mono text-xs mt-2">{err}</p>}
          <button className="mt-4 w-full font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-4 py-3 hover:bg-press-red transition-colors">
            Sign In →
          </button>
          <p className="mt-4 font-mono text-[0.6rem] tracking-[0.18em] uppercase text-ink/40 text-center">Hint for demo: ubepsa2024</p>
        </form>
      </div>
    );
  }

  return <Dashboard onLogout={() => { setAuthed(false); setPwd(""); }} />;
}

type Tab = "articles" | "gallery" | "press" | "stats";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("articles");
  return (
    <div className="page-fade max-w-7xl mx-auto px-4 py-10">
      <div className="rule-double py-3 mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-black text-3xl">Editorial CMS</h1>
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/60">Internal · UBEPSA Newsroom Tools</p>
        </div>
        <button onClick={onLogout} className="font-mono text-[0.65rem] tracking-[0.2em] uppercase border border-ink/40 px-3 py-2 hover:border-press-red hover:text-press-red">Sign Out</button>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-6 border-b border-ink/20">
        {(["articles", "gallery", "press", "stats"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[0.7rem] tracking-[0.18em] uppercase px-4 py-2.5 border-b-2 -mb-px ${tab === t ? "border-press-red text-press-red bg-card" : "border-transparent text-ink/60 hover:text-ink"}`}
          >
            {t === "articles" ? "Articles" : t === "gallery" ? "Gallery" : t === "press" ? "Press Releases" : "Stats"}
          </button>
        ))}
      </div>

      {tab === "articles" && <ArticlesManager />}
      {tab === "gallery" && <GalleryManager />}
      {tab === "press" && <PressManager />}
      {tab === "stats" && <Stats />}
    </div>
  );
}

const inputCls = "w-full bg-cream border border-ink/30 px-3 py-2 font-serif text-sm focus:outline-none focus:border-press-red";
const labelCls = "font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1";

function ArticlesManager() {
  const { articles, addArticle, deleteArticle } = useUbepsa();
  const [form, setForm] = useState({
    title: "", category: "News", author: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    cover: "https://picsum.photos/seed/new-article/1600/1000", body: "", tags: "",
  });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    addArticle({
      title: form.title, category: form.category, author: form.author || "Staff Writer", date: form.date,
      cover: form.cover, body: form.body, excerpt: form.body.slice(0, 180) + (form.body.length > 180 ? "…" : ""),
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
    });
    setForm({ ...form, title: "", body: "", tags: "" });
  };

  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
      <div>
        <h2 className="font-display font-bold text-xl mb-4">New Article</h2>
        <form onSubmit={submit} className="bg-card p-5 border border-ink/15 space-y-3">
          <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={e => update("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Author</label><input className={inputCls} value={form.author} onChange={e => update("author", e.target.value)} /></div>
            <div><label className={labelCls}>Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} /></div>
            <div><label className={labelCls}>Tags (comma-separated)</label><input className={inputCls} value={form.tags} onChange={e => update("tags", e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Cover Image URL</label><input className={inputCls} value={form.cover} onChange={e => update("cover", e.target.value)} /></div>
          <div>
            <label className={labelCls}>Body (use blank lines between paragraphs)</label>
            <textarea rows={8} className={inputCls} value={form.body} onChange={e => update("body", e.target.value)} required />
          </div>
          <button className="font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-5 py-2.5 hover:bg-press-red transition-colors">Publish Article →</button>
        </form>

        <h3 className="font-display font-bold text-lg mt-8 mb-3">Existing Articles ({articles.length})</h3>
        <ul className="divide-y divide-ink/10 bg-card border border-ink/15">
          {articles.map(a => (
            <li key={a.id} className="p-3 flex items-start gap-3">
              <img src={a.cover} alt="" className="w-16 h-16 object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm truncate">{a.title}</p>
                <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-ink/60 mt-0.5">{a.category} · {a.date}</p>
              </div>
              <button onClick={() => deleteArticle(a.id)} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-press-red hover:underline shrink-0">Delete</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-display font-bold text-xl mb-4">Live Preview</h2>
        <div className="bg-card border border-ink/15">
          {form.cover && <img src={form.cover} alt="" className="w-full h-56 object-cover" />}
          <div className="p-5">
            <span className="stamp text-press-red">{form.category}</span>
            <h3 className="font-display font-black text-2xl mt-3 text-ink leading-tight">{form.title || "Untitled article"}</h3>
            <p className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ink/60 mt-2">By {form.author || "—"} · {form.date}</p>
            <div className="font-serif text-ink/85 mt-4 space-y-3 text-sm leading-relaxed">
              {(form.body || "Write your article body in the editor on the left to see it rendered here.").split("\n").filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryManager() {
  const { gallery, addGallery, deleteGallery } = useUbepsa();
  const [form, setForm] = useState({ url: "https://picsum.photos/seed/upload/900/700", title: "", caption: "", photographer: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), album: "Campus" });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || !form.title) return;
    addGallery({ ...form });
    setForm({ ...form, title: "", caption: "" });
  };
  return (
    <div className="space-y-8">
      <form onSubmit={submit} className="bg-card p-5 border border-ink/15 grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2"><label className={labelCls}>Image URL</label><input className={inputCls} value={form.url} onChange={e => update("url", e.target.value)} required /></div>
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
        <div><label className={labelCls}>Photographer</label><input className={inputCls} value={form.photographer} onChange={e => update("photographer", e.target.value)} /></div>
        <div><label className={labelCls}>Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} /></div>
        <div><label className={labelCls}>Album / Event Tag</label><input className={inputCls} value={form.album} onChange={e => update("album", e.target.value)} /></div>
        <div className="sm:col-span-2"><label className={labelCls}>Caption</label><textarea rows={2} className={inputCls} value={form.caption} onChange={e => update("caption", e.target.value)} /></div>
        <button className="sm:col-span-2 justify-self-start font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-5 py-2.5 hover:bg-press-red transition-colors">Add to Gallery →</button>
      </form>

      <div>
        <h3 className="font-display font-bold text-lg mb-3">Gallery ({gallery.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {gallery.map(g => (
            <div key={g.id} className="bg-card border border-ink/15 relative group">
              <img src={g.url} alt={g.title} className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="font-display font-bold text-xs truncate">{g.title}</p>
                <p className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-ink/55 truncate">{g.photographer}</p>
              </div>
              <button onClick={() => deleteGallery(g.id)} className="absolute top-2 right-2 bg-press-red text-cream font-mono text-[0.6rem] tracking-[0.18em] uppercase px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">Del</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PressManager() {
  const { releases, addRelease, deleteRelease } = useUbepsa();
  const [form, setForm] = useState({ title: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), issuer: "UBEPSA Editorial Board", body: "", summary: "" });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    addRelease({ ...form, summary: form.summary || form.body.slice(0, 150) + (form.body.length > 150 ? "…" : "") });
    setForm({ ...form, title: "", body: "", summary: "" });
  };
  return (
    <div className="grid lg:grid-cols-[1fr_1fr] gap-8">
      <form onSubmit={submit} className="bg-card p-5 border border-ink/15 space-y-3">
        <div><label className={labelCls}>Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><label className={labelCls}>Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} /></div>
          <div><label className={labelCls}>Issuing Body</label><input className={inputCls} value={form.issuer} onChange={e => update("issuer", e.target.value)} /></div>
        </div>
        <div><label className={labelCls}>Summary (optional)</label><input className={inputCls} value={form.summary} onChange={e => update("summary", e.target.value)} /></div>
        <div><label className={labelCls}>Full Text</label><textarea rows={10} className={inputCls} value={form.body} onChange={e => update("body", e.target.value)} required /></div>
        <button className="font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-5 py-2.5 hover:bg-press-red transition-colors">Issue Release →</button>
      </form>
      <div>
        <h3 className="font-display font-bold text-lg mb-3">Issued Releases ({releases.length})</h3>
        <ul className="divide-y divide-ink/10 bg-card border border-ink/15">
          {releases.map(r => (
            <li key={r.id} className="p-3 flex items-start gap-3 press-watermark">
              <div className="flex-1 min-w-0">
                <p className="font-display font-bold text-sm">{r.title}</p>
                <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-ink/60 mt-0.5">{r.date} · {r.issuer}</p>
              </div>
              <button onClick={() => deleteRelease(r.id)} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-press-red hover:underline shrink-0">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Stats() {
  const { articles, gallery, releases } = useUbepsa();
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    CATEGORIES.forEach(c => m.set(c, 0));
    articles.forEach(a => m.set(a.category, (m.get(a.category) || 0) + 1));
    return Array.from(m.entries());
  }, [articles]);
  const max = Math.max(1, ...counts.map(([, n]) => n));

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Total Articles" value={articles.length} />
        <Stat label="Total Images" value={gallery.length} />
        <Stat label="Press Releases" value={releases.length} />
      </div>

      <div className="bg-card p-6 border border-ink/15">
        <h3 className="font-mono text-xs tracking-[0.2em] uppercase text-ink/70 font-bold mb-5">Articles per Category</h3>
        <div className="space-y-3">
          {counts.map(([c, n]) => (
            <div key={c}>
              <div className="flex justify-between font-mono text-[0.7rem] tracking-[0.18em] uppercase text-ink/70">
                <span>{c}</span><span>{n}</span>
              </div>
              <div className="h-3 bg-ink/10 mt-1">
                <div className="h-full bg-press-red transition-all" style={{ width: `${(n / max) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-ink text-cream p-6">
      <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-gold">{label}</p>
      <p className="font-display font-black text-5xl mt-2">{value}</p>
    </div>
  );
}
