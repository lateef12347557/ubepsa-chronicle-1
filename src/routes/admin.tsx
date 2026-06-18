import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { CATEGORIES } from "@/lib/ubepsa-store";
import { supabase } from "@/integrations/supabase/client";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Zap, 
  Users, 
  BarChart, 
  GraduationCap, 
  Calendar,
  LogOut,
  ChevronRight
} from "lucide-react";

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
    return <div className="max-w-md mx-auto px-4 py-24 text-center font-mono text-xs tracking-[0.2em] uppercase text-slate-400 animate-pulse">Verifying credentials…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 sm:py-32">
        <div className="mb-10 text-center">
          <div className="inline-block p-4 rounded-3xl bg-blue-50 mb-6 shadow-sm">
             <img src="/logo.jfif" alt="" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">UBEPSA CMS</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">Restricted · Staff Newsroom Tools</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Staff Email</label>
            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 font-medium focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:bg-white focus:outline-none transition-all" autoFocus required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Access Key</label>
            <input type="password" value={pwd} onChange={(e) => { setPwd(e.target.value); setErr(""); }}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-4 py-3 font-medium focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:bg-white focus:outline-none transition-all" required minLength={6} />
          </div>
          {err && <p className="text-destructive font-bold text-xs px-1 text-center">{err}</p>}
          <button disabled={busy} className="w-full bg-ubepsa text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50 active:scale-95">
            {busy ? "Authenticating…" : mode === "signin" ? "Sign In →" : "Create Account →"}
          </button>
          <button type="button" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }}
            className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-ubepsa transition-colors">
            {mode === "signin" ? "Register admin account" : "Back to sign in"}
          </button>
        </form>
      </div>
    );
  }

  return <Dashboard onLogout={logout} />;
}

type Tab = "articles" | "gallery" | "press" | "breaking" | "admins" | "stats" | "scholarships" | "events";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("articles");
  const [email, setEmail] = useState<string>("");
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email?.toLowerCase() ?? ""));
  }, []);

  const isSuperAdmin = email === ADMIN_EMAIL;
  
  const menuItems: { id: Tab; label: string; icon: any }[] = [
    { id: "articles", label: "News", icon: FileText },
    { id: "gallery", label: "Gallery", icon: ImageIcon },
    { id: "press", label: "Press", icon: MessageSquare },
    { id: "breaking", label: "Ticker", icon: Zap },
    { id: "scholarships", label: "Scholarships", icon: GraduationCap },
    { id: "events", label: "Events", icon: Calendar },
    ...(isSuperAdmin ? [{ id: "admins" as Tab, label: "Admins", icon: Users }] : []),
    { id: "stats", label: "Stats", icon: BarChart },
  ];
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full pt-20 lg:pt-24">
        <Sidebar className="border-r border-slate-100 top-20 lg:top-24 h-[calc(100vh-80px)]">
          <SidebarHeader className="p-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-ubepsa/10 flex items-center justify-center p-2 shadow-sm">
                <img src="/logo.jfif" alt="" className="h-full w-full object-contain" />
              </div>
              <div>
                <h2 className="font-black text-slate-900 leading-tight">UBEPSA CMS</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Control Center</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id} className="mb-1">
                      <SidebarMenuButton 
                        onClick={() => setTab(item.id)} 
                        isActive={tab === item.id}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                          tab === item.id 
                            ? "bg-ubepsa text-white shadow-lg shadow-blue-500/20" 
                            : "text-slate-500 hover:bg-slate-50 hover:text-ubepsa"
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${tab === item.id ? "text-white" : "text-slate-400"}`} />
                        <span className="font-bold text-sm">{item.label}</span>
                        {tab === item.id && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-6 border-t border-slate-50">
            <button 
              onClick={onLogout} 
              className="w-full flex items-center justify-center gap-3 bg-slate-50 text-slate-600 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-destructive hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 overflow-auto bg-white p-4 sm:p-10">
          <div className="flex items-center gap-4 mb-8 lg:hidden">
            <SidebarTrigger className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-ubepsa hover:text-white transition-all" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          </div>
          
          <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Management Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">UBEPSA Internal · Systems Control</p>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tab === "articles" && <ArticlesManager />}
            {tab === "gallery" && <GalleryManager />}
            {tab === "press" && <PressManager />}
            {tab === "breaking" && <BreakingManager />}
            {tab === "scholarships" && <ScholarshipManager />}
            {tab === "events" && <EventManager />}
            {tab === "admins" && isSuperAdmin && <AdminsManager />}
            {tab === "stats" && <Stats />}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AdminsManager() {
  const [admins, setAdmins] = useState<{ userId: string; email: string; createdAt: string }[]>([]);
  const [superEmail] = useState<string>(ADMIN_EMAIL);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const refresh = async () => {
    try {
      const { data, error } = await supabase.rpc("list_admins");
      if (error) throw error;
      setAdmins((data ?? []).map((r: { user_id: string; email: string; created_at: string }) => ({
        userId: r.user_id, email: r.email, createdAt: r.created_at,
      })));
    } catch (e) { setErr((e as Error).message); }
  };
  useEffect(() => { refresh(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { error } = await supabase.rpc("grant_admin_by_email", { _email: email.trim() });
      if (error) throw error;
      setMsg(`Granted admin to ${email.trim()}.`);
      setEmail("");
      await refresh();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };

  const onRevoke = async (userId: string, em: string) => {
    if (!confirm(`Revoke admin from ${em}?`)) return;
    setErr(""); setMsg(""); setBusy(true);
    try {
      const { error } = await supabase.rpc("revoke_admin", { _user_id: userId });
      if (error) throw error;
      setMsg(`Revoked admin from ${em}.`);
      await refresh();
    } catch (e) { setErr((e as Error).message); }
    finally { setBusy(false); }
  };


  return (
    <div className="max-w-3xl space-y-10">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Admin Access Control</h2>
        <p className="text-sm font-medium text-slate-500">Only the primary association admin ({superEmail}) can modify staff permissions.</p>
      </div>
      
      <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
        <div>
          <label className={labelCls}>Grant Admin Access (Email)</label>
          <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="staff@uniben.edu" required />
        </div>
        <button disabled={busy} className="bg-ubepsa text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 active:scale-95">
          {busy ? "Processing…" : "Add Staff Member →"}
        </button>
        {err && <p className="text-destructive font-bold text-xs mt-2">{err}</p>}
        {msg && <p className="text-ubepsa font-bold text-xs mt-2">{msg}</p>}
      </form>

      <div>
        <h3 className="text-lg font-black text-slate-900 mb-6 px-1">Current Staff Directory ({admins.length})</h3>
        <div className="grid gap-4">
          {admins.map((a) => {
            const isSuper = a.email.toLowerCase() === superEmail.toLowerCase();
            return (
              <div key={a.userId} className="p-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black ${isSuper ? "bg-ubepsa text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-400"}`}>
                    {a.email[0].toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{a.email}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isSuper ? "Primary Admin" : "Staff Member"}</p>
                  </div>
                </div>
                {!isSuper && (
                  <button onClick={() => onRevoke(a.userId, a.email)} disabled={busy}
                    className="text-[10px] font-black text-destructive uppercase tracking-widest hover:bg-destructive/5 px-4 py-2 rounded-lg transition-all disabled:opacity-50">Revoke</button>
                )}
              </div>
            );
          })}
        </div>
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
    <div className="max-w-3xl space-y-10">
      <div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">News Ticker Control</h2>
        <p className="text-sm font-medium text-slate-500">Important headlines that scroll across every page of the association website.</p>
      </div>
      
      <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
        <div>
          <label className={labelCls}>Headline Content</label>
          <input className={inputCls} value={text} onChange={(e) => setText(e.target.value)} placeholder="BREAKING — Orientation starts tomorrow at LT1…" required />
        </div>
        <button disabled={busy} className="bg-ubepsa text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-lg shadow-blue-500/10 disabled:opacity-50 active:scale-95">
          {busy ? "Saving…" : "Post to Ticker →"}
        </button>
      </form>

      <div>
        <h3 className="text-lg font-black text-slate-900 mb-6 px-1">Live Headlines ({breaking.length})</h3>
        {breaking.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50 shadow-inner">
             <p className="text-slate-400 font-bold italic">No active headlines. The news ticker is currently hidden.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {breaking.map((b) => (
              <div key={b.id} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm group">
                {editingId === b.id ? (
                  <div className="space-y-4">
                    <input className={inputCls} value={editText} onChange={(e) => setEditText(e.target.value)} autoFocus />
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(b.id)} disabled={busy} className="bg-ubepsa text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-ubepsa-dark transition-all disabled:opacity-50">Save</button>
                      <button onClick={cancelEdit} className="bg-slate-100 text-slate-500 px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-6">
                    <p className="font-medium text-slate-700 leading-relaxed flex-1">{b.text}</p>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEdit(b.id, b.text)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-ubepsa transition-colors p-2">Edit</button>
                      <button onClick={() => deleteBreaking(b.id)} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-destructive transition-colors p-2">Delete</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


const inputCls = "w-full bg-slate-50 border-2 border-slate-50 rounded-2xl px-5 py-4 font-medium focus:ring-4 focus:ring-ubepsa/10 focus:border-ubepsa focus:bg-white focus:outline-none transition-all text-slate-700";
const labelCls = "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2 px-1";

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
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row items-center gap-4">
        <label className="w-full xs:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-ubepsa transition-all active:scale-95 shadow-lg shadow-blue-900/10 text-center">
          {busy ? "Uploading…" : "Upload System"}
          <input type="file" accept="image/*" className="hidden" disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </label>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">— OR —</span>
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Remote Image URL (https://…)" />
      </div>
      {err && <p className="text-destructive font-bold text-[10px] uppercase tracking-widest">{err}</p>}
      {value && (
        <div className="relative inline-block group">
           <img src={value} alt="" className="w-48 h-32 object-cover rounded-2xl shadow-xl border-4 border-white" />
           <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Selected Image</span>
           </div>
        </div>
      )}
    </div>
  );
}


function ArticlesManager() {
  const { articles, addArticle, deleteArticle } = useUbepsa();
  const [form, setForm] = useState({
    title: "", category: "News", author: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    cover: "https://picsum.photos/seed/ubepsa/1600/1000", body: "", tags: "",
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
    <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Publish New Story</h2>
          <p className="text-sm font-medium text-slate-500">Draft and publish articles directly to the association newsfeed.</p>
        </div>
        
        <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
          <div><label className={labelCls}>Story Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className={labelCls}>Category</label>
              <select className={inputCls} value={form.category} onChange={e => update("category", e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div><label className={labelCls}>Author Name</label><input className={inputCls} value={form.author} onChange={e => update("author", e.target.value)} /></div>
            <div><label className={labelCls}>Publish Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} /></div>
            <div><label className={labelCls}>Tags (commas)</label><input className={inputCls} value={form.tags} onChange={e => update("tags", e.target.value)} placeholder="Health, Campus, etc." /></div>
          </div>
          <div><label className={labelCls}>Feature Image</label><ImageUploader value={form.cover} onChange={(v) => update("cover", v)} /></div>
          <div>
            <label className={labelCls}>Article Body</label>
            <textarea rows={10} className={`${inputCls} resize-none`} value={form.body} onChange={e => update("body", e.target.value)} required placeholder="Write your content here..." />
          </div>
          <button className="bg-ubepsa text-white w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl shadow-blue-500/20 active:scale-95">Publish Story →</button>
        </form>
      </div>

      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Story Preview</h2>
          <p className="text-sm font-medium text-slate-500">This is how your article will appear on the live site.</p>
        </div>
        
        <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden sticky top-24">
          <div className="aspect-video bg-slate-50 overflow-hidden">
             {form.cover && <img src={form.cover} alt="" className="w-full h-full object-cover" />}
          </div>
          <div className="p-8 sm:p-12">
            <span className="bg-blue-50 text-ubepsa px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">{form.category}</span>
            <h3 className="text-3xl font-black text-slate-900 mt-6 leading-tight tracking-tight">{form.title || "Untitled story"}</h3>
            <div className="flex items-center gap-3 mt-6 text-slate-400 font-bold text-[10px] uppercase tracking-widest pb-8 border-b border-slate-50">
               <span className="text-slate-900">{form.author || "UBEPSA Staff"}</span>
               <span>•</span>
               <span>{form.date}</span>
            </div>
            <div className="mt-8 text-slate-600 leading-relaxed font-medium space-y-4">
              {(form.body || "Your article content will render here in real-time as you type in the editor...").split("\n").filter(Boolean).slice(0, 3).map((p, i) => <p key={i}>{p}</p>)}
              {form.body && form.body.split("\n").length > 3 && <p className="text-ubepsa font-black italic">Read more...</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryManager() {
  const { gallery, addGallery, deleteGallery } = useUbepsa();
  const [form, setForm] = useState({ url: "https://picsum.photos/seed/ubepsa/900/700", title: "", caption: "", photographer: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), album: "Department" });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || !form.title) return;
    addGallery({ ...form });
    setForm({ ...form, title: "", caption: "" });
  };
  return (
    <div className="space-y-16">
      <div className="max-w-4xl">
        <h2 className="text-2xl font-black text-slate-900 mb-2">Gallery Upload</h2>
        <p className="text-sm font-medium text-slate-500 mb-8">Add visual memories to the departmental gallery.</p>
        
        <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
          <div><label className={labelCls}>Image Source</label><ImageUploader value={form.url} onChange={(v) => update("url", v)} /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className={labelCls}>Photo Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
            <div><label className={labelCls}>Photographer</label><input className={inputCls} value={form.photographer} onChange={e => update("photographer", e.target.value)} /></div>
            <div><label className={labelCls}>Capture Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} /></div>
            <div><label className={labelCls}>Album Name</label><input className={inputCls} value={form.album} onChange={e => update("album", e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Full Caption</label><textarea rows={3} className={`${inputCls} resize-none`} value={form.caption} onChange={e => update("caption", e.target.value)} /></div>
          <button className="bg-ubepsa text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl shadow-blue-500/10 active:scale-95">Add to Collection →</button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-900 mb-8 px-1 tracking-tight">Active Collection ({gallery.length})</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {gallery.map(g => (
            <div key={g.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden relative group shadow-sm hover:shadow-lg transition-all">
              <div className="aspect-square bg-slate-50">
                 <img src={g.url} alt={g.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="p-3">
                <p className="font-bold text-slate-900 text-xs truncate leading-tight">{g.title}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1 truncate">{g.photographer || "Staff"}</p>
              </div>
              <button onClick={() => deleteGallery(g.id)} className="absolute top-2 right-2 bg-destructive text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg active:scale-90">
                 🗑️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PressManager() {
  const { releases, addRelease, deleteRelease } = useUbepsa();
  const [form, setForm] = useState({ title: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), issuer: "UBEPSA Executive Council", body: "", summary: "" });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    addRelease({ ...form, summary: form.summary || form.body.slice(0, 150) + (form.body.length > 150 ? "…" : "") });
    setForm({ ...form, title: "", body: "", summary: "" });
  };
  return (
    <div className="grid lg:grid-cols-2 gap-16">
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Issue Press Release</h2>
          <p className="text-sm font-medium text-slate-500">Official statements and association announcements.</p>
        </div>
        
        <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
          <div><label className={labelCls}>Release Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className={labelCls}>Release Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} /></div>
            <div><label className={labelCls}>Issuing Authority</label><input className={inputCls} value={form.issuer} onChange={e => update("issuer", e.target.value)} /></div>
          </div>
          <div><label className={labelCls}>Brief Summary</label><input className={inputCls} value={form.summary} onChange={e => update("summary", e.target.value)} placeholder="One sentence highlight..." /></div>
          <div><label className={labelCls}>Full Statement Content</label><textarea rows={10} className={`${inputCls} resize-none`} value={form.body} onChange={e => update("body", e.target.value)} required /></div>
          <button className="bg-slate-900 text-white w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa transition-all shadow-xl active:scale-95">Issue Official Release →</button>
        </form>
      </div>

      <div>
        <h3 className="text-xl font-black text-slate-900 mb-8 px-1 tracking-tight">Active Releases ({releases.length})</h3>
        <div className="space-y-4">
          {releases.map(r => (
            <div key={r.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm group relative overflow-hidden">
              <div className="flex items-start justify-between gap-6 relative z-10">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-lg leading-tight mb-2">{r.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{r.date} · {r.issuer}</p>
                </div>
                <button onClick={() => deleteRelease(r.id)} className="text-[10px] font-black text-destructive uppercase tracking-widest hover:underline p-2 shrink-0">Delete</button>
              </div>
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stats() {
  const { articles, gallery, releases, events, scholarships } = useUbepsa();
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    CATEGORIES.forEach(c => m.set(c, 0));
    articles.forEach(a => m.set(a.category, (m.get(a.category) || 0) + 1));
    return Array.from(m.entries());
  }, [articles]);
  const max = Math.max(1, ...counts.map(([, n]) => n));

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <Stat label="Stories" value={articles.length} />
        <Stat label="Images" value={gallery.length} />
        <Stat label="Press" value={releases.length} />
        <Stat label="Events" value={events.length} />
        <Stat label="Grants" value={scholarships.length} />
      </div>

      <div className="bg-white p-8 sm:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-blue-900/5">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 text-center">Content Distribution Matrix</h3>
        <div className="space-y-6 max-w-4xl mx-auto">
          {counts.map(([c, n]) => (
            <div key={c} className="group">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-black text-slate-700 uppercase tracking-widest group-hover:text-ubepsa transition-colors">{c}</span>
                <span className="text-xl font-black text-slate-900">{n}</span>
              </div>
              <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                <div className="h-full bg-ubepsa rounded-full transition-all duration-1000 shadow-lg shadow-blue-500/40" style={{ width: `${(n / max) * 100}%` }} />
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
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-blue-900/5 text-center group hover:-translate-y-1 transition-transform">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 group-hover:text-ubepsa transition-colors">{label}</p>
      <p className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter">{value}</p>
    </div>
  );
}

function ScholarshipManager() {
  const { scholarships, addScholarship, deleteScholarship } = useUbepsa();
  const [form, setForm] = useState({ title: "", description: "", eligibility: "", deadline: "", link: "" });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    addScholarship({ ...form });
    setForm({ title: "", description: "", eligibility: "", deadline: "", link: "" });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16">
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">New Grant Opportunity</h2>
          <p className="text-sm font-medium text-slate-500">Provide scholarship and financial aid information for students.</p>
        </div>
        <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
          <div><label className={labelCls}>Grant Title</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
          <div><label className={labelCls}>Eligibility Criteria</label><input className={inputCls} value={form.eligibility} onChange={e => update("eligibility", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className={labelCls}>Application Deadline</label><input className={inputCls} value={form.deadline} onChange={e => update("deadline", e.target.value)} placeholder="30 June 2024" /></div>
            <div><label className={labelCls}>Application Portal (Link)</label><input className={inputCls} value={form.link} onChange={e => update("link", e.target.value)} placeholder="https://..." /></div>
          </div>
          <div><label className={labelCls}>Program Description</label><textarea rows={6} className={`${inputCls} resize-none`} value={form.description} onChange={e => update("description", e.target.value)} required /></div>
          <button className="bg-ubepsa text-white w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl active:scale-95">Post Opportunity →</button>
        </form>
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-8 px-1 tracking-tight">Active Programs ({scholarships.length})</h3>
        <div className="space-y-4">
          {scholarships.map(s => (
            <div key={s.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm group">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-lg leading-tight mb-2 truncate">{s.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.deadline || "Open Enrollment"}</p>
                </div>
                <button onClick={() => deleteScholarship(s.id)} className="text-[10px] font-black text-destructive uppercase tracking-widest hover:underline p-2 shrink-0">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventManager() {
  const { events, addEvent, deleteEvent } = useUbepsa();
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "", image_url: "" });
  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    addEvent({ ...form });
    setForm({ title: "", description: "", date: "", location: "", image_url: "" });
  };

  return (
    <div className="grid lg:grid-cols-2 gap-16">
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Schedule Activity</h2>
          <p className="text-sm font-medium text-slate-500">Add departmental events, workshops, or association meetings.</p>
        </div>
        <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
          <div><label className={labelCls}>Event Name</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div><label className={labelCls}>Event Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} placeholder="15 July 2024" required /></div>
            <div><label className={labelCls}>Campus Location</label><input className={inputCls} value={form.location} onChange={e => update("location", e.target.value)} placeholder="LT 1, UNIBEN" required /></div>
          </div>
          <div><label className={labelCls}>Promotional Banner</label><ImageUploader value={form.image_url} onChange={(v) => update("image_url", v)} /></div>
          <div><label className={labelCls}>Activity Overview</label><textarea rows={6} className={`${inputCls} resize-none`} value={form.description} onChange={e => update("description", e.target.value)} required /></div>
          <button className="bg-ubepsa text-white w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl active:scale-95">Schedule Event →</button>
        </form>
      </div>
      <div>
        <h3 className="text-xl font-black text-slate-900 mb-8 px-1 tracking-tight">Upcoming Schedule ({events.length})</h3>
        <div className="space-y-4">
          {events.map(e => (
            <div key={e.id} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm group">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-lg leading-tight mb-2 truncate">{e.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.date} · {e.location}</p>
                </div>
                <button onClick={() => deleteEvent(e.id)} className="text-[10px] font-black text-destructive uppercase tracking-widest hover:underline p-2 shrink-0">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
