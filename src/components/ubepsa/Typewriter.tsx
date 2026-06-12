import { useEffect, useState } from "react";

export function Typewriter({ text, speed = 38, className = "" }: { text: string; speed?: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return (
    <span className={className}>
      {text.slice(0, n)}
      <span className="caret" aria-hidden />
    </span>
  );
}
