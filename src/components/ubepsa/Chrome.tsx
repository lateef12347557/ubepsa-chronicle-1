import { useEffect, useState } from "react";

/** Mounts: page loader (one-shot), custom cursor, scroll-reveal observer. */
export function Chrome() {
  const [loading, setLoading] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("pv:seen");
  });

  // Loader → dismiss after 1.5s
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("pv:seen", "1");
      setLoading(false);
    }, 1900);
    return () => clearTimeout(t);
  }, [loading]);

  // Custom cursor
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
    let raf = 0;
    let x = 0, y = 0, tx = 0, ty = 0;
    const move = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest("a, button, [role='button'], input, textarea, .flip-card")) dot.classList.add("hover");
      else dot.classList.remove("hover");
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      cancelAnimationFrame(raf);
      dot.remove();
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
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
    <div className="loader-shell">
      <div className="loader-mark">
        Physio<span>V</span>ibes
      </div>
    </div>
  );
}
