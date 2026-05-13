import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { CATEGORIES } from "@/lib/ubepsa-store";
import { supabase } from "@/integrations/supabase/client";
import { listAdmins, grantAdmin, revokeAdmin } from "@/lib/admins.functions";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const ADMIN_EMAIL = "ubepsaadmin@gmail.com";

function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const verifyAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setIsAdmin(false); setChecking(false); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    setIsAdmin(!!roles?.some((r) => r.role === "admin"));
    setChecking(false);
  };

  useEffect(() => {
    verifyAdmin();
    const { data: sub } = supabase.auth.onAuthStateChange(() => { verifyAdmin(); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      if (mode === "signup") {
        if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
          setErr("Only the official UBEPSA admin email can register here.");
          setBusy(false); return;
        }
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: pwd,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pwd });
        if (error) throw error;
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally { setBusy(false); }
  };

  const logout = async () => { await supabase.auth.signOut(); setIsAdmin(false); setEmail(""); setPwd(""); };

  if (checking) {
    return <div className="page-fade max-w-md mx-auto px-4 py-20 text-center font-mono text-xs tracking-[0.2em] uppercase text-ink/60">Verifying credentials…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="page-fade max-w-md mx-auto px-4 py-20">
        <div className="rule-double py-3 mb-6 text-center">
          <h1 className="font-display font-black text-3xl">Editorial CMS</h1>
          <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/60 mt-1">Restricted · UBEPSA Staff Only</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card p-6 border border-ink/20 space-y-4">
          <div>
            <label className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              className="w-full bg-cream border border-ink/30 px-3 py-2 font-mono focus:outline-none focus:border-press-red" autoFocus required />
          </div>
          <div>
            <label className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1">Password</label>
            <input type="password" value={pwd} onChange={(e) => { setPwd(e.target.value); setErr(""); }}
              className="w-full bg-cream border border-ink/30 px-3 py-2 font-mono focus:outline-none focus:border-press-red" required minLength={6} />
          </div>
          {err && <p className="text-press-red font-mono text-xs">{err}</p>}
          <button disabled={busy} className="w-full font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-4 py-3 hover:bg-press-red transition-colors disabled:opacity-50">
            {busy ? "Working…" : mode === "signin" ? "Sign In →" : "Create Admin Account →"}
          </button>
          <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }}
            className="w-full font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/60 hover:text-press-red">
            {mode === "signin" ? "First-time setup? Register admin" : "Have an account? Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return <Dashboard onLogout={logout} />;
}

type Tab = "articles" | "gallery" | "press" | "breaking" | "admins" | "stats";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("articles");
  const [email, setEmail] = useState<string>("");
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email?.toLowerCase() ?? ""));
  }, []);
  const isSuperAdmin = email === ADMIN_EMAIL;
  const labels: Record<Tab, string> = { articles: "Articles", gallery: "Gallery", press: "Press Releases", breaking: "Breaking News", admins: "Admins", stats: "Stats" };
  const tabs: Tab[] = ["articles", "gallery", "press", "breaking", ...(isSuperAdmin ? ["admins" as Tab] : []), "stats"];
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
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-mono text-[0.7rem] tracking-[0.18em] uppercase px-4 py-2.5 border-b-2 -mb-px ${tab === t ? "border-press-red text-press-red bg-card" : "border-transparent text-ink/60 hover:text-ink"}`}
          >
            {labels[t]}
          </button>
        ))}
      </div>

      {tab === "articles" && <ArticlesManager />}
      {tab === "gallery" && <GalleryManager />}
      {tab === "press" && <PressManager />}
      {tab === "breaking" && <BreakingManager />}
      {tab === "admins" && isSuperAdmin && <AdminsManager />}
      {tab === "stats" && <Stats />}
    </div>
  );
}

function AdminsManager() {
  const list = useServerFn(listAdmins);
  const grant = useServerFn(grantAdmin);
  const revoke = useServerFn(revokeAdmin);
  const [admins, setAdmins] = useState<{ userId: string; email: string; createdAt: string }[]>([]);
  const [superEmail, setSuperEmail] = useState<string>(ADMIN_EMAIL);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = async () => {
    try {
      const r = await list();
      setAdmins(r.admins);
      setSuperEmail(r.superAdminEmail);
    } catch (e) { setErr((e as Error).message); }
  };
  useEffect(() => { refresh(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      const r = await grant({ data: { email: email.trim() } });
      setMsg(`Granted admin to ${r.email}.`);
      setEmail("");
      await refresh();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  const onRevoke = async (userId: string, em: string) => {
    if (!confirm(`Revoke admin from ${em}?`)) return;
    setErr(""); setMsg(""); setBusy(true);
    try { await revoke({ data: { userId } }); setMsg(`Revoked admin from ${em}.`); await refresh(); }
    catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">Admin Access</h2>
        <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/60">Only the primary admin ({superEmail}) can grant or revoke admin access. Users must already have an account.</p>
      </div>
      <form onSubmit={submit} className="bg-card p-5 border border-ink/15 space-y-3">
        <label className={labelCls}>Grant Admin by Email</label>
        <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="person@example.com" required />
        <button disabled={busy} className="font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-5 py-2.5 hover:bg-press-red transition-colors disabled:opacity-50">
          {busy ? "Working…" : "Grant Admin →"}
        </button>
        {err && <p className="text-press-red font-mono text-xs">{err}</p>}
        {msg && <p className="text-ink/80 font-mono text-xs">{msg}</p>}
      </form>
      <div>
        <h3 className="font-display font-bold text-lg mb-3">Current Admins ({admins.length})</h3>
        <ul className="divide-y divide-ink/10 bg-card border border-ink/15">
          {admins.map((a) => {
            const isSuper = a.email.toLowerCase() === superEmail.toLowerCase();
            return (
              <li key={a.userId} className="p-3 flex items-center gap-3">
                <span className="text-press-red font-mono text-xs">◆</span>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-sm truncate">{a.email}</p>
                  {isSuper && <p className="font-mono text-[0.6rem] tracking-[0.18em] uppercase text-ink/50">Primary admin</p>}
                </div>
                {!isSuper && (
                  <button onClick={() => onRevoke(a.userId, a.email)} disabled={busy}
                    className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-press-red hover:underline shrink-0 disabled:opacity-50">Revoke</button>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function BreakingManager() {
  const { breaking, addBreaking, deleteBreaking, updateBreaking } = useUbepsa();
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    try { await addBreaking(text.trim()); setText(""); } finally { setBusy(false); }
  };

  const startEdit = (id: string, current: string) => { setEditingId(id); setEditText(current); };
  const cancelEdit = () => { setEditingId(null); setEditText(""); };
  const saveEdit = async (id: string) => {
    if (!editText.trim()) return;
    setBusy(true);
    try { await updateBreaking(id, editText.trim()); cancelEdit(); } finally { setBusy(false); }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl mb-1">Breaking News Ticker</h2>
        <p className="font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/60">Headlines scroll across every page. The ticker is hidden when empty.</p>
      </div>
      <form onSubmit={submit} className="bg-card p-5 border border-ink/15 space-y-3">
        <label className={labelCls}>New Headline</label>
        <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="BREAKING — …" required />
        <button disabled={busy} className="font-mono text-xs tracking-[0.2em] uppercase bg-ink text-cream px-5 py-2.5 hover:bg-press-red transition-colors disabled:opacity-50">
          {busy ? "Saving…" : "Add to Ticker →"}
        </button>
      </form>
      <div>
        <h3 className="font-display font-bold text-lg mb-3">Active Headlines ({breaking.length})</h3>
        {breaking.length === 0 ? (
          <p className="font-serif italic text-ink/60 text-sm">No headlines yet. Add one above — the ticker stays hidden until you do.</p>
        ) : (
          <ul className="divide-y divide-ink/10 bg-card border border-ink/15">
            {breaking.map((b) => (
              <li key={b.id} className="p-3 flex items-start gap-3">
                <span className="text-press-red font-mono text-xs mt-2">◆</span>
                {editingId === b.id ? (
                  <div className="flex-1 space-y-2">
                    <input className={inputCls} value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(b.id)} disabled={busy} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase bg-ink text-cream px-3 py-1.5 hover:bg-press-red transition-colors disabled:opacity-50">Save</button>
                      <button onClick={cancelEdit} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase border border-ink/30 px-3 py-1.5 hover:bg-ink/5">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="flex-1 font-serif text-sm">{b.text}</p>
                    <div className="flex gap-3 shrink-0">
                      <button onClick={() => startEdit(b.id, b.text)} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-ink hover:underline">Edit</button>
                      <button onClick={() => deleteBreaking(b.id)} className="font-mono text-[0.65rem] tracking-[0.18em] uppercase text-press-red hover:underline">Delete</button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


const inputCls = "w-full bg-cream border border-ink/30 px-3 py-2 font-serif text-sm focus:outline-none focus:border-press-red";
const labelCls = "font-mono text-[0.65rem] tracking-[0.2em] uppercase text-ink/70 block mb-1";

function ImageUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (file: File) => {
    setErr(""); setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("ubepsa-media").upload(path, file, {
        contentType: file.type, upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("ubepsa-media").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="font-mono text-[0.65rem] tracking-[0.2em] uppercase bg-ink text-cream px-3 py-2 cursor-pointer hover:bg-press-red transition-colors">
          {busy ? "Uploading…" : "Choose file"}
          <input type="file" accept="image/*" className="hidden" disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </label>
        <span className="font-mono text-[0.65rem] text-ink/50">or paste URL below</span>
      </div>
      <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
      {err && <p className="text-press-red font-mono text-xs">{err}</p>}
      {value && <img src={value} alt="" className="w-32 h-20 object-cover border border-ink/15" />}
    </div>
  );
}


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
          <div><label className={labelCls}>Cover Image</label><ImageUploader value={form.cover} onChange={(v) => update("cover", v)} /></div>
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
        <div className="sm:col-span-2"><label className={labelCls}>Image</label><ImageUploader value={form.url} onChange={(v) => update("url", v)} /></div>
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
