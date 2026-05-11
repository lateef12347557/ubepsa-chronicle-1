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
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [a, g, p, b] = await Promise.all([
      supabase.from("articles").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery_items").select("*").order("created_at", { ascending: false }),
      supabase.from("press_releases").select("*").order("created_at", { ascending: false }),
      supabase.from("breaking_news").select("*").order("position", { ascending: true }),
    ]);
    if (a.data) setArticles(a.data.map((r) => mapArticle(r as ArticleRow)));
    if (g.data) setGallery(g.data as GalleryItem[]);
    if (p.data) setReleases(p.data as PressRelease[]);
    if (b.data) setBreaking(b.data as BreakingItem[]);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

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

  return { articles, gallery, releases, breaking, loading, refresh, addArticle, deleteArticle, addGallery, deleteGallery, addRelease, deleteRelease, addBreaking, deleteBreaking };
}

