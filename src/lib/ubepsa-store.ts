import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Article = {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  cover: string;
  excerpt: string;
  body: string;
  tags: string[];
  readTime: number;
};

export type GalleryItem = {
  id: string;
  url: string;
  title: string;
  caption: string;
  photographer: string;
  date: string;
  album: string;
};

export type PressRelease = {
  id: string;
  title: string;
  date: string;
  body: string;
  issuer: string;
  summary: string;
};

export type BreakingItem = { id: string; text: string; position: number };

export type Scholarship = {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  deadline?: string;
  link?: string;
  created_at: string;
};

export type UbepsaEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url?: string;
  created_at: string;
};

export const CATEGORIES = ["News", "Opinion", "Campus Life", "Features", "Press Release", "Photography"];

const estimateReadTime = (body: string) => Math.max(2, Math.ceil(body.split(/\s+/).length / 220));

type ArticleRow = {
  id: string; title: string; category: string; author: string; date: string;
  cover: string; excerpt: string; body: string; tags: string[] | null; read_time: number;
};
const mapArticle = (r: ArticleRow): Article => ({
  id: r.id, title: r.title, category: r.category, author: r.author, date: r.date,
  cover: r.cover, excerpt: r.excerpt, body: r.body, tags: r.tags ?? [], readTime: r.read_time,
});

export function useUbepsaStore() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [releases, setReleases] = useState<PressRelease[]>([]);
  const [breaking, setBreaking] = useState<BreakingItem[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [events, setEvents] = useState<UbepsaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [a, g, p, b, s, e] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_items").select("*").order("created_at", { ascending: false }),
      supabase.from("press_releases").select("*").order("created_at", { ascending: false }),
      supabase.from("breaking_news").select("*").order("position", { ascending: true }),
      supabase.from("scholarships").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("created_at", { ascending: false }),
    ]);
    if (a.data) setArticles(a.data.map((r) => mapArticle(r as ArticleRow)));
    if (g.data) setGallery(g.data as GalleryItem[]);
    if (p.data) setReleases(p.data as PressRelease[]);
    if (b.data) setBreaking(b.data as BreakingItem[]);
    if (s.data) setScholarships(s.data as Scholarship[]);
    if (e.data) setEvents(e.data as UbepsaEvent[]);
    setLoading(false);
  }, []);

  useEffect(() => { 
    refresh(); 
    
    // Subscribe to ALL relevant tables for real-time updates
    const channels = [
      "articles", "gallery_items", "press_releases", 
      "breaking_news", "scholarships", "events"
    ].map(table => 
      supabase
        .channel(`public:${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () => {
          refresh(); // Re-fetch all data on any change
        })
        .subscribe()
    );

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [refresh]);

  const addArticle = useCallback(async (a: Omit<Article, "id" | "readTime"> & { readTime?: number }) => {
    const { data, error } = await supabase.from("articles").insert({
      title: a.title, category: a.category, author: a.author, date: a.date,
      cover: a.cover, excerpt: a.excerpt, body: a.body, tags: a.tags,
      read_time: a.readTime ?? estimateReadTime(a.body),
    }).select().single();
    if (error) throw error;
    setArticles((prev) => [mapArticle(data as ArticleRow), ...prev]);
  }, []);

  const deleteArticle = useCallback(async (id: string) => {
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) throw error;
    setArticles((p) => p.filter((a) => a.id !== id));
  }, []);

  const updateArticle = useCallback(async (id: string, a: Partial<Article>) => {
    const updateData: any = {};
    if (a.title !== undefined) updateData.title = a.title;
    if (a.category !== undefined) updateData.category = a.category;
    if (a.author !== undefined) updateData.author = a.author;
    if (a.date !== undefined) updateData.date = a.date;
    if (a.cover !== undefined) updateData.cover = a.cover;
    if (a.excerpt !== undefined) updateData.excerpt = a.excerpt;
    if (a.body !== undefined) updateData.body = a.body;
    if (a.tags !== undefined) updateData.tags = a.tags;
    if (a.body !== undefined && a.readTime === undefined) updateData.read_time = estimateReadTime(a.body);
    else if (a.readTime !== undefined) updateData.read_time = a.readTime;

    const { data, error } = await supabase.from("articles").update(updateData).eq("id", id).select().single();
    if (error) throw error;
    setArticles((prev) => prev.map((art) => (art.id === id ? mapArticle(data as ArticleRow) : art)));
  }, []);

  const addGallery = useCallback(async (g: Omit<GalleryItem, "id">) => {
    const { data, error } = await supabase.from("gallery_items").insert(g).select().single();
    if (error) throw error;
    setGallery((p) => [data as GalleryItem, ...p]);
  }, []);

  const deleteGallery = useCallback(async (id: string) => {
    const { error } = await supabase.from("gallery_items").delete().eq("id", id);
    if (error) throw error;
    setGallery((p) => p.filter((g) => g.id !== id));
  }, []);

  const addRelease = useCallback(async (r: Omit<PressRelease, "id">) => {
    const { data, error } = await supabase.from("press_releases").insert(r).select().single();
    if (error) throw error;
    setReleases((p) => [data as PressRelease, ...p]);
  }, []);

  const deleteRelease = useCallback(async (id: string) => {
    const { error } = await supabase.from("press_releases").delete().eq("id", id);
    if (error) throw error;
    setReleases((p) => p.filter((r) => r.id !== id));
  }, []);

  const addBreaking = useCallback(async (text: string) => {
    const position = Date.now();
    const { data, error } = await supabase.from("breaking_news").insert({ text, position }).select().single();
    if (error) throw error;
    setBreaking((p) => [...p, data as BreakingItem]);
  }, []);

  const deleteBreaking = useCallback(async (id: string) => {
    const { error } = await supabase.from("breaking_news").delete().eq("id", id);
    if (error) throw error;
    setBreaking((p) => p.filter((b) => b.id !== id));
  }, []);

  const updateBreaking = useCallback(async (id: string, text: string) => {
    const { data, error } = await supabase.from("breaking_news").update({ text }).eq("id", id).select().single();
    if (error) throw error;
    setBreaking((p) => p.map((b) => (b.id === id ? (data as BreakingItem) : b)));
  }, []);

  const addScholarship = useCallback(async (s: Omit<Scholarship, "id" | "created_at">) => {
    const { data, error } = await supabase.from("scholarships").insert(s).select().single();
    if (error) throw error;
    setScholarships((p) => [data as Scholarship, ...p]);
  }, []);

  const deleteScholarship = useCallback(async (id: string) => {
    const { error } = await supabase.from("scholarships").delete().eq("id", id);
    if (error) throw error;
    setScholarships((p) => p.filter((s) => s.id !== id));
  }, []);

  const addEvent = useCallback(async (e: Omit<UbepsaEvent, "id" | "created_at">) => {
    const { data, error } = await supabase.from("events").insert(e).select().single();
    if (error) {
      console.error("Supabase insert error (events):", error);
      throw error;
    }
    setEvents((p) => [data as UbepsaEvent, ...p]);
  }, []);

  const deleteEvent = useCallback(async (id: string) => {
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) throw error;
    setEvents((p) => p.filter((e) => e.id !== id));
  }, []);

  const updateEvent = useCallback(async (id: string, e: Partial<UbepsaEvent>) => {
    const { data, error } = await supabase.from("events").update(e).eq("id", id).select().single();
    if (error) {
      console.error("Supabase update error (events):", error);
      throw error;
    }
    setEvents((p) => p.map((event) => (event.id === id ? (data as UbepsaEvent) : event)));
  }, []);

  return { 
    articles, gallery, releases, breaking, scholarships, events, loading, refresh, 
    addArticle, deleteArticle, addGallery, deleteGallery, addRelease, deleteRelease, 
    addBreaking, deleteBreaking, updateBreaking, addScholarship, deleteScholarship, 
    addEvent, deleteEvent 
  };
}

