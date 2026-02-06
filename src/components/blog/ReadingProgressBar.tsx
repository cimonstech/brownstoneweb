"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    function update() {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setPercent(height > 0 ? Math.min(100, (winScroll / height) * 100) : 0);
    }
    update();
    window.addEventListener("scroll", update);
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-white/20 dark:bg-black/20">
      <div
        className="h-full bg-primary transition-all duration-150"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
