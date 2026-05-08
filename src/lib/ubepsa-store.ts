import { useState, useCallback } from "react";

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

export const CATEGORIES = ["News", "Opinion", "Campus Life", "Features", "Press Release", "Photography"];

const img = (seed: string, w = 1200, h = 800) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const seedArticles: Article[] = [
  {
    id: "a1",
    title: "UNIBEN Senate Approves Sweeping Curriculum Reform for 2026 Session",
    category: "News",
    author: "Adaeze Okonkwo",
    date: "May 6, 2026",
    cover: img("uniben-senate", 1600, 1000),
    excerpt: "In a landmark sitting, the University Senate ratified a multi-faculty overhaul that introduces interdisciplinary tracks, mandatory civic-tech modules, and a revised grading rubric across colleges.",
    body: "In a landmark sitting that ran late into Tuesday evening, the University of Benin Senate ratified a multi-faculty overhaul that introduces interdisciplinary tracks, mandatory civic-tech modules, and a revised grading rubric across colleges.\n\nThe proposal, championed by the Office of the Vice-Chancellor, has been in committee review for nearly eighteen months. It promises a leaner credit load and a renewed emphasis on research-led teaching across the Faculties of Arts, Engineering, and the Social Sciences.\n\n\"This is the most ambitious academic reform UNIBEN has attempted in a generation,\" the VC told reporters following the session. The first cohort under the new framework will matriculate in October.",
    tags: ["Senate", "Reform", "Academics"],
    readTime: 6,
  },
  {
    id: "a2",
    title: "Why Campus Journalism Still Matters in the Age of TikTok",
    category: "Opinion",
    author: "Ifeoma Bello",
    date: "May 4, 2026",
    cover: img("typewriter-news", 1600, 1000),
    excerpt: "Short-form video has rewritten the rules of attention. But the slow craft of campus reporting remains the conscience of the university.",
    body: "Short-form video has rewritten the rules of attention. Every hostel corridor is now its own broadcast studio, every cafeteria queue a potential viral moment.\n\nAnd yet the slow craft of campus reporting — the verified quote, the second source, the careful paragraph — remains the conscience of the university. UBEPSA exists because someone, somewhere, has to write the first draft of UNIBEN's history.\n\nWe are not competing with TikTok. We are doing something it cannot.",
    tags: ["Media", "Journalism", "Essay"],
    readTime: 4,
  },
  {
    id: "a3",
    title: "Inside the Hostel: A Week with UNIBEN's Night-Shift Cleaners",
    category: "Features",
    author: "Tunde Adebayo",
    date: "May 2, 2026",
    cover: img("hostel-night", 1600, 1000),
    excerpt: "They keep Hall 4 standing. They are paid less than minimum wage. We spent seven nights with the women who scrub UNIBEN clean while it sleeps.",
    body: "Mama Sade arrives at 11:47 p.m. every night, six nights a week, carrying her own broom because the hostel never replaces them.\n\nThis is a story about labour, dignity, and the quiet economy that holds a university together. For seven nights we walked the corridors of Hall 4 with the women who scrub UNIBEN clean while it sleeps.",
    tags: ["Long Read", "Labour", "Hostel"],
    readTime: 12,
  },
  {
    id: "a4",
    title: "Pirates Win EUI Cup in Penalty Shootout Thriller at Adamasingba",
    category: "Campus Life",
    author: "Kelechi Umeh",
    date: "Apr 29, 2026",
    cover: img("football-stadium", 1600, 1000),
    excerpt: "A drenched pitch, ninety scoreless minutes, and a goalkeeper who became a folk hero. The Pirates lift the inter-faculty cup for a third straight year.",
    body: "A drenched pitch. Ninety scoreless minutes. And then Emeka Igwe, all 6'2 of him, threw himself at the fifth penalty and made a folk hero of his gloves.\n\nThe Pirates lift the EUI Cup for a third consecutive year, sealing a dynasty that began on a much sunnier afternoon in 2024.",
    tags: ["Sports", "EUI", "Football"],
    readTime: 5,
  },
  {
    id: "a5",
    title: "Photo Essay: Convocation 2026 in Twelve Frames",
    category: "Photography",
    author: "Zara Mohammed",
    date: "Apr 25, 2026",
    cover: img("convocation-cap", 1600, 1000),
    excerpt: "Caps, tears, and a downpour that nobody had the heart to flee. UBEPSA's lead photographer documents a day of arrivals and goodbyes.",
    body: "Caps. Tears. A downpour that nobody had the heart to flee. Convocation is the one day of the year when the university looks like the brochure.\n\nThis is UNIBEN, in twelve frames.",
    tags: ["Convocation", "Photo Essay"],
    readTime: 3,
  },
  {
    id: "a6",
    title: "Editorial: The Library Must Open Past Midnight Again",
    category: "Opinion",
    author: "The Editorial Board",
    date: "Apr 22, 2026",
    cover: img("library-open", 1600, 1000),
    excerpt: "The 10 p.m. closure was always temporary. Three years on, our students are studying by phone-torch in stairwells. The administration must act.",
    body: "The 10 p.m. closure was always meant to be temporary. Three years on, our students are studying by phone-torch in stairwells, on staircases, and in the harsh fluorescent of the cafeteria after it shuts.\n\nThe John Harris Library is the academic heart of this university. A heart cannot beat on banker's hours.",
    tags: ["Editorial", "Library", "Campus"],
    readTime: 4,
  },
];

export const seedGallery: GalleryItem[] = [
  { id: "g1", url: img("uniben-gate", 900, 1200), title: "Main Gate at Dawn", caption: "First light over the iconic UNIBEN gate.", photographer: "Zara Mohammed", date: "Apr 18, 2026", album: "Campus" },
  { id: "g2", url: img("library-stack", 900, 700), title: "John Harris Stacks", caption: "The third-floor philosophy stacks.", photographer: "Tunde Adebayo", date: "Apr 12, 2026", album: "Campus" },
  { id: "g3", url: img("convo-cap", 900, 1100), title: "Cap Toss", caption: "The customary toss outside Akin Deko.", photographer: "Zara Mohammed", date: "Apr 25, 2026", album: "Convocation" },
  { id: "g4", url: img("pirates-cup", 900, 800), title: "Pirates Lift the Cup", caption: "Captain Onyeka raises the EUI trophy.", photographer: "Kelechi Umeh", date: "Apr 29, 2026", album: "Sports" },
  { id: "g5", url: img("rally-press", 900, 1000), title: "Press Freedom Rally", caption: "Students march for press protections on campus.", photographer: "Ifeoma Bello", date: "Mar 30, 2026", album: "Events" },
  { id: "g6", url: img("market-st", 900, 700), title: "Ekosodin Market", caption: "Saturday afternoon at the student market.", photographer: "Tunde Adebayo", date: "Mar 22, 2026", album: "Campus" },
  { id: "g7", url: img("debate-night", 900, 900), title: "Debate Night", caption: "The semi-final of the inter-hall debates.", photographer: "Adaeze Okonkwo", date: "Apr 8, 2026", album: "Events" },
  { id: "g8", url: img("rain-walk", 900, 1100), title: "Rainy Commute", caption: "Students cross the quad after a sudden storm.", photographer: "Zara Mohammed", date: "Apr 2, 2026", album: "Campus" },
];

export const seedReleases: PressRelease[] = [
  {
    id: "p1",
    title: "UBEPSA Statement on Recent Hostel Allocation Concerns",
    date: "May 5, 2026",
    issuer: "UBEPSA Editorial Board",
    summary: "The Association calls for an open audit of the 2026 hostel allocation process and urges transparency from the Dean of Students Affairs.",
    body: "The University of Benin Press and Students' Association notes with concern the persistent reports of irregularities in the 2026 hostel allocation process.\n\nWe call upon the Office of the Dean of Students Affairs to publish, in full, the criteria and final allocation lists no later than 15 May 2026.\n\nA student body that cannot trust the roof over its head cannot be expected to trust the institution above it.",
  },
  {
    id: "p2",
    title: "UBEPSA Welcomes the New Curriculum Reforms",
    date: "May 7, 2026",
    issuer: "Office of the Editor-in-Chief",
    summary: "UBEPSA expresses cautious optimism following Senate's approval of the 2026 curriculum overhaul.",
    body: "UBEPSA expresses cautious optimism following the Senate's ratification of the curriculum reform package.\n\nWe particularly welcome the introduction of mandatory media literacy modules and pledge our editorial support for their development.",
  },
  {
    id: "p3",
    title: "Call for Submissions: 2026 UBEPSA Annual Magazine",
    date: "Apr 30, 2026",
    issuer: "UBEPSA Features Desk",
    summary: "Submissions are now open for the flagship annual print magazine. Deadline 30 June.",
    body: "Submissions are now open for the 2026 edition of the UBEPSA Annual Magazine.\n\nWe welcome essays, reportage, photo essays, and short fiction from all registered students. Submission window closes 30 June 2026.",
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function useUbepsaStore() {
  const [articles, setArticles] = useState<Article[]>(seedArticles);
  const [gallery, setGallery] = useState<GalleryItem[]>(seedGallery);
  const [releases, setReleases] = useState<PressRelease[]>(seedReleases);

  const addArticle = useCallback((a: Omit<Article, "id" | "readTime"> & { readTime?: number }) => {
    setArticles(prev => [{ ...a, id: uid(), readTime: a.readTime ?? Math.max(2, Math.ceil(a.body.split(/\s+/).length / 220)) }, ...prev]);
  }, []);
  const deleteArticle = useCallback((id: string) => setArticles(p => p.filter(a => a.id !== id)), []);

  const addGallery = useCallback((g: Omit<GalleryItem, "id">) => setGallery(p => [{ ...g, id: uid() }, ...p]), []);
  const deleteGallery = useCallback((id: string) => setGallery(p => p.filter(g => g.id !== id)), []);

  const addRelease = useCallback((r: Omit<PressRelease, "id">) => setReleases(p => [{ ...r, id: uid() }, ...p]), []);
  const deleteRelease = useCallback((id: string) => setReleases(p => p.filter(r => r.id !== id)), []);

  return { articles, gallery, releases, addArticle, deleteArticle, addGallery, deleteGallery, addRelease, deleteRelease };
}
