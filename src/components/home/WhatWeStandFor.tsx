"use client";

import { useState } from "react";
import { FaIcon } from "@/components/Icons";

const items = [
  {
    title: "Our Signature",
    content:
      "Precision engineering meets visionary architecture. We deliver landmarks that define skylines and communities.",
  },
  {
    title: "Our Legacy",
    content:
      "Every project is built to last. We combine heritage craftsmanship with sustainable practices for generations to come.",
  },
  {
    title: "Our Delivery",
    content:
      "From concept to completion, we maintain uncompromising standards and transparent communication with every partner.",
  },
];

export default function WhatWeStandFor() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-32 lg:py-48 px-8 lg:px-20 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-36 items-start">
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-bold text-corporate-blue leading-tight">
            What We Stand For
          </h2>
          <div className="space-y-4">
            {items.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full text-left border-b border-grey/20 pb-6 pt-4 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-grey font-medium text-lg group-hover:text-corporate-blue transition-colors">
                    {item.title}
                  </span>
                  <span
                    className={`text-corporate-blue transition-transform inline-flex ${
                      open === i ? "rotate-90" : ""
                    }`}
                  >
                    <FaIcon name="arrowRight" />
                  </span>
                </div>
                {open === i && (
                  <p className="mt-4 text-grey font-light leading-relaxed">
                    {item.content}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
