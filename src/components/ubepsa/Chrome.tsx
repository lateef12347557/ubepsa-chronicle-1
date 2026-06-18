import { useEffect, useState } from "react";

/** Mounts: page loader (one-shot), refined cursor (ring + dot), scroll-reveal observer. */
export function Chrome() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("pv:seen");
  });

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("pv:seen", "1");
      setLoading(false);
    }, 1200);
    return () => clearTimeout(t);
  }, [loading]);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    const scan = () => document.querySelectorAll(".reveal:not(.in)").forEach((n) => io.observe(n));
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);

  if (!loading) return null;
  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center animate-bounce">
          <span className="text-white font-bold text-2xl">U</span>
        </div>
        <div className="font-display text-4xl font-black text-ubepsa tracking-tighter uppercase">
          UBEPSA
        </div>
      </div>
    </div>
  );
}

