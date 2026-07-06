import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useUbepsa } from "@/components/ubepsa/UbepsaProvider";
import { CATEGORIES, type Magazine, type PageContent } from "@/lib/ubepsa-store";
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
  ChevronRight,
  BookOpen,
  Plus,
  Trash
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

type Tab = "articles" | "gallery" | "press" | "breaking" | "admins" | "stats" | "scholarships" | "events" | "magazines";

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { loading } = useUbepsa();
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
    { id: "magazines", label: "Magazines", icon: BookOpen },
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
                <div className="flex items-center gap-1.5 mt-0.5">
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Sync Active</p>
                </div>
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
        <SidebarInset className="flex-1 overflow-auto bg-white p-4 sm:p-10 relative">
          {loading && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 overflow-hidden z-50">
              <div className="h-full bg-ubepsa w-1/3 animate-[progress_1s_infinite_linear]" />
            </div>
          )}
          
          <div className="flex items-center gap-4 mb-8 lg:hidden">
            <SidebarTrigger className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:bg-ubepsa hover:text-white transition-all" />
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          </div>
          
          <div className="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-8 border-b border-slate-100">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Management Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">UBEPSA Internal · Systems Control</p>
            </div>
            {loading && <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing changes…</span>}
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {tab === "articles" && <ArticlesManager />}
            {tab === "gallery" && <GalleryManager />}
            {tab === "press" && <PressManager />}
            {tab === "breaking" && <BreakingManager />}
            {tab === "scholarships" && <ScholarshipManager />}
            {tab === "events" && <EventManager />}
            {tab === "magazines" && <MagazinesManager />}
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

function PdfUploader({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const handleFile = async (file: File) => {
    setErr(""); setBusy(true);
    try {
      const ext = file.name.split(".").pop() || "pdf";
      if (ext.toLowerCase() !== "pdf") {
        throw new Error("Only PDF files are allowed.");
      }
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
          {busy ? "Uploading…" : "Upload PDF"}
          <input type="file" accept="application/pdf" className="hidden" disabled={busy}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
        </label>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">— OR —</span>
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="Remote PDF URL (https://…)" />
      </div>
      {err && <p className="text-destructive font-bold text-[10px] uppercase tracking-widest">{err}</p>}
      {value && (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center font-bold text-xs uppercase shrink-0">PDF</div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-700 truncate">{value}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Uploaded & Ready</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ArticlesManager() {
  const { articles, addArticle, deleteArticle, updateArticle } = useUbepsa();
  const emptyForm = {
    title: "", category: "News", author: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    cover: "https://picsum.photos/seed/ubepsa/1600/1000", body: "", tags: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const startEdit = (a: Article) => {
    setEditingId(a.id);
    setForm({
      title: a.title,
      category: a.category,
      author: a.author,
      date: a.date,
      cover: a.cover,
      body: a.body,
      tags: a.tags.join(", "),
    });
    setMsg("");
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      const articleData = {
        title: form.title, category: form.category, author: form.author || "Staff Writer", date: form.date,
        cover: form.cover, body: form.body, excerpt: form.body.slice(0, 180) + (form.body.length > 180 ? "…" : ""),
        tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      };

      if (editingId) {
        await updateArticle(editingId, articleData);
        setMsg("Article updated successfully!");
        cancelEdit();
      } else {
        await addArticle(articleData);
        setForm(emptyForm);
        setMsg("Article published successfully!");
      }
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid lg:grid-cols-2 gap-10 sm:gap-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{editingId ? "Edit Story" : "Publish New Story"}</h2>
            <p className="text-sm font-medium text-slate-500">{editingId ? "Modify your existing story content." : "Draft and publish articles directly to the association newsfeed."}</p>
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
            {err && <p className="text-destructive font-bold text-xs">{err}</p>}
            {msg && <p className="text-emerald-500 font-bold text-xs">{msg}</p>}
            <div className="flex gap-4">
              <button disabled={busy} className="bg-ubepsa text-white flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50">
                {busy ? (editingId ? "Updating..." : "Publishing...") : (editingId ? "Update Story →" : "Publish Story →")}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                  Cancel
                </button>
              )}
            </div>
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

      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8 px-1 tracking-tight">Published Stories ({articles.length})</h3>
        <div className="grid gap-4">
          {articles.map((a) => (
            <div key={a.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
              <div className="flex items-center gap-6 min-w-0">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0">
                  <img src={a.cover} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black text-ubepsa uppercase tracking-widest">{a.category}</span>
                  <p className="font-bold text-slate-900 text-lg leading-tight truncate">{a.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{a.date} • {a.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button onClick={() => startEdit(a)} className="bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-ubepsa hover:text-white transition-all shadow-sm">
                  Edit
                </button>
                <button onClick={() => { if(confirm("Delete this article?")) deleteArticle(a.id); }} className="bg-slate-50 text-slate-400 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GalleryManager() {
  const { gallery, addGallery, deleteGallery } = useUbepsa();
  const [form, setForm] = useState({ url: "https://picsum.photos/seed/ubepsa/900/700", title: "", caption: "", photographer: "", date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }), album: "Department" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url || !form.title) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      await addGallery({ ...form });
      setForm({ ...form, title: "", caption: "" });
      setMsg("Photo added to gallery successfully!");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
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
          
          {err && <p className="text-destructive font-bold text-xs">{err}</p>}
          {msg && <p className="text-emerald-500 font-bold text-xs">{msg}</p>}

          <button disabled={busy} className="bg-ubepsa text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl shadow-blue-500/10 active:scale-95 disabled:opacity-50">
            {busy ? "Adding..." : "Add to Collection →"}
          </button>
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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      await addRelease({ ...form, summary: form.summary || form.body.slice(0, 150) + (form.body.length > 150 ? "…" : "") });
      setForm({ ...form, title: "", body: "", summary: "" });
      setMsg("Press release issued successfully!");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
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
          
          {err && <p className="text-destructive font-bold text-xs">{err}</p>}
          {msg && <p className="text-emerald-500 font-bold text-xs">{msg}</p>}

          <button disabled={busy} className="bg-slate-900 text-white w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa transition-all shadow-xl active:scale-95 disabled:opacity-50">
            {busy ? "Issuing..." : "Issue Official Release →"}
          </button>
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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      await addScholarship({ ...form });
      setForm({ title: "", description: "", eligibility: "", deadline: "", link: "" });
      setMsg("Scholarship opportunity posted successfully!");
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
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
          
          {err && <p className="text-destructive font-bold text-xs">{err}</p>}
          {msg && <p className="text-emerald-500 font-bold text-xs">{msg}</p>}
          
          <button disabled={busy} className="bg-ubepsa text-white w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl active:scale-95 disabled:opacity-50">
            {busy ? "Posting..." : "Post Opportunity →"}
          </button>
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
  const { events, addEvent, deleteEvent, updateEvent } = useUbepsa();
  const emptyForm = { title: "", description: "", date: "", location: "", image_url: "" };
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const startEdit = (e: UbepsaEvent) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      description: e.description,
      date: e.date,
      location: e.location,
      image_url: e.image_url || "",
    });
    setMsg("");
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };
  
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      if (editingId) {
        await updateEvent(editingId, form);
        setMsg("Event updated successfully!");
        cancelEdit();
      } else {
        await addEvent({ ...form });
        setForm(emptyForm);
        setMsg("Event scheduled successfully!");
      }
    } catch (e: any) {
      console.error("Event save error:", e);
      setErr(e.message || "Failed to save event. Please check your connection or admin permissions.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-16">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{editingId ? "Edit Activity" : "Schedule Activity"}</h2>
            <p className="text-sm font-medium text-slate-500">{editingId ? "Modify the details of your scheduled event." : "Add departmental events, workshops, or association meetings."}</p>
          </div>
          <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
            <div><label className={labelCls}>Event Name</label><input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div><label className={labelCls}>Event Date</label><input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} placeholder="15 July 2024" required /></div>
              <div><label className={labelCls}>Campus Location</label><input className={inputCls} value={form.location} onChange={e => update("location", e.target.value)} placeholder="LT 1, UNIBEN" required /></div>
            </div>
            <div><label className={labelCls}>Promotional Banner</label><ImageUploader value={form.image_url} onChange={(v) => update("image_url", v)} /></div>
            <div><label className={labelCls}>Activity Overview</label><textarea rows={6} className={`${inputCls} resize-none`} value={form.description} onChange={e => update("description", e.target.value)} required /></div>
            
            {err && <p className="text-destructive font-bold text-xs">{err}</p>}
            {msg && <p className="text-emerald-500 font-bold text-xs">{msg}</p>}

            <div className="flex gap-4">
              <button disabled={busy} className="bg-ubepsa text-white flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl active:scale-95 disabled:opacity-50">
                {busy ? (editingId ? "Updating..." : "Scheduling...") : (editingId ? "Update Event →" : "Schedule Event →")}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Event Preview</h2>
            <p className="text-sm font-medium text-slate-500">How this event will appear to students.</p>
          </div>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 overflow-hidden sticky top-24">
            <div className="h-48 sm:h-64 bg-slate-50 relative overflow-hidden">
               {form.image_url ? (
                 <img src={form.image_url} alt="" className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-slate-200 font-black text-2xl uppercase tracking-[0.2em]">UBEPSA Event</div>
               )}
            </div>
            <div className="p-8 sm:p-10">
               <div className="flex items-center gap-2 mb-4">
                  <span className="bg-ubepsa/10 text-ubepsa px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest">{form.date || "Date TBA"}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{form.location || "Location TBA"}</span>
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{form.title || "Event Title"}</h3>
               <p className="text-slate-500 font-medium text-sm leading-relaxed line-clamp-4">{form.description || "Description will appear here..."}</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8 px-1 tracking-tight">Scheduled Activities ({events.length})</h3>
        <div className="grid gap-4">
          {events.map(e => (
            <div key={e.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
              <div className="flex items-center gap-6 min-w-0">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 overflow-hidden flex-shrink-0">
                  <img src={e.image_url || "/exco1.jfif"} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-lg leading-tight truncate">{e.title}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{e.date} • {e.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button onClick={() => startEdit(e)} className="bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-ubepsa hover:text-white transition-all shadow-sm">
                  Edit
                </button>
                <button onClick={() => { if(confirm("Delete this event?")) deleteEvent(e.id); }} className="bg-slate-50 text-slate-400 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-sm">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PRESET_GRADIENTS = [
  { name: "Blue Violet", value: "from-blue-600 via-indigo-600 to-violet-700" },
  { name: "Emerald Teal", value: "from-emerald-600 via-teal-600 to-cyan-700" },
  { name: "Amber Red", value: "from-amber-600 via-orange-600 to-red-700" },
  { name: "Rose Fuchsia", value: "from-rose-600 via-pink-600 to-fuchsia-700" },
  { name: "Slate Charcoal", value: "from-slate-700 via-zinc-800 to-stone-900" },
];

function MagazinesManager() {
  const { magazines, addMagazine, deleteMagazine, updateMagazine } = useUbepsa();
  const emptyForm = {
    volume: "11",
    issue: "1",
    title: "",
    subtitle: "",
    date: "",
    description: "",
    bgGradient: "from-blue-600 via-indigo-600 to-violet-700",
    pdfSize: "8.4 MB",
    pdfUrl: "",
    features: "",
  };
  const [form, setForm] = useState(emptyForm);
  const [pages, setPages] = useState<PageContent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const update = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const startEdit = (m: Magazine) => {
    setEditingId(m.id);
    setForm({
      volume: String(m.volume),
      issue: String(m.issue),
      title: m.title,
      subtitle: m.subtitle,
      date: m.date,
      description: m.description,
      bgGradient: m.bgGradient,
      pdfSize: m.pdfSize,
      pdfUrl: m.pdfUrl || "",
      features: m.features.join(", "),
    });
    setPages(m.pages || []);
    setMsg("");
    setErr("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPages([]);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.volume || !form.issue || !form.date) return;
    setBusy(true); setErr(""); setMsg("");
    try {
      const magazineData = {
        volume: parseInt(form.volume, 10) || 1,
        issue: parseInt(form.issue, 10) || 1,
        title: form.title,
        subtitle: form.subtitle,
        date: form.date,
        description: form.description,
        bgGradient: form.bgGradient,
        pdfSize: form.pdfSize,
        pdfUrl: form.pdfUrl || null,
        features: form.features.split(",").map(f => f.trim()).filter(Boolean),
        pages: pages,
      };

      if (editingId) {
        await updateMagazine(editingId, magazineData);
        setMsg("Magazine updated successfully!");
        cancelEdit();
      } else {
        await addMagazine(magazineData);
        setForm(emptyForm);
        setPages([]);
        setMsg("Magazine added successfully!");
      }
    } catch (e: any) {
      console.error("Magazine save error:", e);
      setErr(e.message || "Failed to save magazine. Please check your connection or admin permissions.");
    } finally {
      setBusy(false);
    }
  };

  const addPage = () => {
    setPages(p => [
      ...p,
      {
        type: "article",
        title: `Page ${p.length + 1}`,
        subtitle: "",
        author: "",
        columns: [["Column 1 text..."], ["Column 2 text..."]],
        quote: "",
      }
    ]);
  };

  const removePage = (index: number) => {
    setPages(p => p.filter((_, i) => i !== index));
  };

  const updatePageField = (index: number, field: keyof PageContent, value: any) => {
    setPages(p => p.map((page, i) => {
      if (i === index) {
        return { ...page, [field]: value };
      }
      return page;
    }));
  };

  const updatePageColumn = (pageIndex: number, colIndex: number, text: string) => {
    setPages(p => p.map((page, i) => {
      if (i === pageIndex) {
        const nextCols = [...page.columns];
        nextCols[colIndex] = [text];
        return { ...page, columns: nextCols };
      }
      return page;
    }));
  };

  return (
    <div className="space-y-16">
      <div className="grid lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7 space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">{editingId ? "Edit Magazine" : "Add Magazine Issue"}</h2>
            <p className="text-sm font-medium text-slate-500">{editingId ? "Modify the metadata, cover design, and pages of the selected volume." : "Publish a new volume of the PhysioVibes Magazine on the student website."}</p>
          </div>
          
          <form onSubmit={submit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-2xl shadow-blue-900/5 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Volume Number</label>
                <input type="number" className={inputCls} value={form.volume} onChange={e => update("volume", e.target.value)} required min={1} />
              </div>
              <div>
                <label className={labelCls}>Issue Number</label>
                <input type="number" className={inputCls} value={form.issue} onChange={e => update("issue", e.target.value)} required min={1} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Volume Title (e.g. Reimagining Rehab)</label>
                <input className={inputCls} value={form.title} onChange={e => update("title", e.target.value)} required />
              </div>
              <div>
                <label className={labelCls}>Theme Subtitle</label>
                <input className={inputCls} value={form.subtitle} onChange={e => update("subtitle", e.target.value)} placeholder="The Tech Era in Physiotherapy" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Publication Date</label>
                <input className={inputCls} value={form.date} onChange={e => update("date", e.target.value)} placeholder="June 2026" required />
              </div>
              <div>
                <label className={labelCls}>Cover Theme / Gradient</label>
                <select className={inputCls} value={form.bgGradient} onChange={e => update("bgGradient", e.target.value)}>
                  {PRESET_GRADIENTS.map(g => (
                    <option key={g.value} value={g.value}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>PDF File Size</label>
                <input className={inputCls} value={form.pdfSize} onChange={e => update("pdfSize", e.target.value)} placeholder="8.4 MB" required />
              </div>
              <div>
                <label className={labelCls}>PDF Download Link (Optional)</label>
                <PdfUploader value={form.pdfUrl} onChange={(v) => update("pdfUrl", v)} />
              </div>
            </div>

            <div>
              <label className={labelCls}>Key Features (comma-separated list)</label>
              <input className={inputCls} value={form.features} onChange={e => update("features", e.target.value)} placeholder="AI Diagnostics, Robotic Exoskeletons, Student Spotlights" />
            </div>

            <div>
              <label className={labelCls}>Editorial Summary / Description</label>
              <textarea rows={4} className={`${inputCls} resize-none`} value={form.description} onChange={e => update("description", e.target.value)} required />
            </div>

            {/* Interactive Page Builder */}
            <div className="border-t border-slate-100 pt-6 space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Interactive Pages ({pages.length})</h3>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">Build the internal pages of the online reader preview.</p>
                </div>
                <button 
                  type="button" 
                  onClick={addPage} 
                  className="flex items-center gap-1 bg-blue-50 text-ubepsa px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider hover:bg-blue-100 transition-all cursor-pointer shadow-sm animate-none"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Page
                </button>
              </div>

              {pages.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50">
                  <p className="text-slate-400 font-bold text-xs">No preview pages added yet.</p>
                  <button type="button" onClick={addPage} className="text-xs text-ubepsa font-black uppercase tracking-widest mt-2 hover:underline">Create First Page</button>
                </div>
              ) : (
                <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 border-l-2 border-slate-200 pl-4">
                  {pages.map((page, idx) => (
                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative space-y-4">
                      <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                        <span className="text-xs font-black text-slate-600 uppercase tracking-widest">Page {idx + 1}</span>
                        <button 
                          type="button" 
                          onClick={() => removePage(idx)} 
                          className="text-slate-400 hover:text-destructive transition-colors cursor-pointer"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Page Type</label>
                          <select 
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:outline-none"
                            value={page.type} 
                            onChange={e => updatePageField(idx, "type", e.target.value)}
                          >
                            <option value="editorial">Editorial</option>
                            <option value="article">Article</option>
                            <option value="interview">Interview</option>
                            <option value="gallery">Outreach / Gallery</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Page Title</label>
                          <input 
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                            value={page.title} 
                            onChange={e => updatePageField(idx, "title", e.target.value)} 
                            placeholder="e.g. AI & Biomechanics" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Subtitle</label>
                          <input 
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                            value={page.subtitle || ""} 
                            onChange={e => updatePageField(idx, "subtitle", e.target.value)} 
                            placeholder="Optional subtitle" 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Author / Speaker</label>
                          <input 
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                            value={page.author || ""} 
                            onChange={e => updatePageField(idx, "author", e.target.value)} 
                            placeholder="e.g. Dr. Cole / Editor" 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Left Column Text</label>
                          <textarea 
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none resize-none"
                            value={page.columns[0]?.[0] || ""} 
                            onChange={e => updatePageColumn(idx, 0, e.target.value)} 
                            placeholder="Enter paragraph text..." 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Right Column Text</label>
                          <textarea 
                            rows={3}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-600 focus:outline-none resize-none"
                            value={page.columns[1]?.[0] || ""} 
                            onChange={e => updatePageColumn(idx, 1, e.target.value)} 
                            placeholder="Enter paragraph text..." 
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block mb-1">Callout Quote (Optional)</label>
                        <input 
                          className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none"
                          value={page.quote || ""} 
                          onChange={e => updatePageField(idx, "quote", e.target.value)} 
                          placeholder="Highlight quote..." 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {err && <p className="text-destructive font-bold text-xs">{err}</p>}
            {msg && <p className="text-emerald-500 font-bold text-xs">{msg}</p>}

            <div className="flex gap-4">
              <button disabled={busy} className="bg-ubepsa text-white flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-ubepsa-dark transition-all shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer">
                {busy ? (editingId ? "Saving..." : "Adding...") : (editingId ? "Save Changes →" : "Add Magazine →")}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="bg-slate-100 text-slate-500 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 cursor-pointer">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Live Preview Pane */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 mb-2">Cover Preview</h2>
            <p className="text-sm font-medium text-slate-500">Live styling preview of the magazine cover design.</p>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-blue-900/5 flex justify-center sticky top-24 select-none">
            <div className="w-full max-w-[280px] aspect-[3/4] rounded-2xl shadow-[0_15px_35px_rgba(9,30,66,0.15)] overflow-hidden relative animate-none">
              <div className={`w-full h-full bg-gradient-to-br ${form.bgGradient} p-6 flex flex-col justify-between text-white relative`}>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/20 mix-blend-overlay pointer-events-none" />
                
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-10 h-10 bg-white rounded-xl p-1 shadow-md mb-3 border border-white/20">
                    <img src="/logo.jfif" alt="" className="h-full w-full object-contain" />
                  </div>
                  <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white/70 mb-1 leading-none">Official Publication</p>
                  <h3 className="text-2xl font-black tracking-tighter uppercase leading-none font-display">
                    PHYSIO<span className="opacity-80">VIBES</span>
                  </h3>
                  <div className="w-6 h-[1.5px] bg-white/40 my-2" />
                  <p className="text-[6px] font-black uppercase tracking-widest text-center text-white/80">University of Benin</p>
                </div>

                <div className="relative z-10 space-y-3">
                  <div className="space-y-1">
                    <span className="text-[6px] font-black uppercase tracking-widest bg-white/20 px-1.5 py-0.5 rounded border border-white/10">
                      Vol. {form.volume || "1"} · Issue {form.issue || "1"}
                    </span>
                    <h4 className="text-xl font-black leading-tight tracking-tight mt-1">
                      {form.title || "Volume Title"}
                    </h4>
                    <p className="text-[8px] font-bold text-white/80 leading-snug">
                      {form.subtitle || "Volume theme subtitle"}
                    </p>
                  </div>

                  <div className="border-t border-white/20 pt-2">
                    <p className="text-[5px] font-bold uppercase tracking-wider text-white/50 mb-1">Featured:</p>
                    <p className="text-[6px] font-black text-white/85 line-clamp-2 leading-tight">
                      {form.features || "List of articles on the cover"}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-end border-t border-white/10 pt-2 text-[6px] font-black text-white/60 uppercase tracking-widest">
                  <span>{form.date || "Date TBA"}</span>
                  <span>UBEPSA Editorial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Magazines List */}
      <div>
        <h3 className="text-2xl font-black text-slate-900 mb-8 px-1 tracking-tight">Magazines Database ({magazines.length})</h3>
        {magazines.length === 0 ? (
          <div className="py-12 text-center border border-slate-100 rounded-[2rem] bg-white">
            <p className="text-slate-400 font-bold">No magazines found in the database. Static fallbacks are active on the main page.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {magazines.map(m => (
              <div key={m.id} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 group">
                <div className="flex items-center gap-6 min-w-0">
                  <div className={`h-16 w-12 rounded-lg bg-gradient-to-br ${m.bgGradient} flex-shrink-0 flex items-center justify-center p-2 text-white shadow-md relative overflow-hidden`}>
                    <span className="text-[8px] font-black uppercase tracking-widest z-10">V{m.volume}</span>
                    <div className="absolute inset-0 bg-black/10 z-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 text-lg leading-tight truncate">{m.title}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Vol. {m.volume} · Issue {m.issue} • {m.date} • {m.pages?.length || 0} Pages</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button onClick={() => startEdit(m)} className="bg-slate-50 text-slate-600 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-ubepsa hover:text-white transition-all shadow-sm cursor-pointer">
                    Edit
                  </button>
                  <button onClick={() => { if(confirm("Are you sure you want to delete this magazine edition?")) deleteMagazine(m.id); }} className="bg-slate-50 text-slate-400 px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-destructive hover:text-white transition-all shadow-sm cursor-pointer">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
