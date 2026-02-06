"use client";

import { useEffect, useRef, useState } from "react";

type Item = {
  position: number;
  image_url: string | null;
  property_name: string | null;
  project_link: string | null;
};

export function NowSellingSidebar({ items }: { items: Item[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const valid = items.filter((i) => i.image_url && i.property_name);
  if (valid.length === 0) return null;

  useEffect(() => {
    if (paused) return;
    const el = scrollRef.current;
    if (!el) return;
    let animation: number;
    const step = () => {
      el.scrollTop += 0.5;
      if (el.scrollTop >= el.scrollHeight / 2) el.scrollTop = 0;
      animation = requestAnimationFrame(step);
    };
    animation = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animation);
  }, [valid.length, paused]);

  const duplicated = [...valid, ...valid];

  return (
    <div className="rounded-xl border border-earthy/10 bg-white/50 overflow-hidden">
      <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-earthy/80 px-6 pt-6 pb-3">
        Signature Listings
      </h4>
      <div
        ref={scrollRef}
        className="h-[420px] overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar"
        style={{ scrollBehavior: "auto" }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="flex flex-col gap-6 px-6 pb-6">
          {duplicated.map((item, idx) => (
            <a
              key={`${item.position}-${idx}`}
              href={item.project_link || "#"}
              target={item.project_link ? "_blank" : undefined}
              rel={item.project_link ? "noopener noreferrer" : undefined}
              onClick={(e) => !item.project_link && e.preventDefault()}
              className="block group"
            >
              <div className="aspect-[2/3] rounded-lg overflow-hidden bg-neutral-100">
                <img
                  src={item.image_url!}
                  alt=""
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <p className="mt-2 text-sm font-medium text-earthy/90 group-hover:text-primary transition-colors">
                {item.property_name}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
