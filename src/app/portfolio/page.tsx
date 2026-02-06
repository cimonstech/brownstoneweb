"use client";

import { useState, useCallback } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";

const R2 = "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main";

const celestiaImages = [
  { src: `${R2}/CHALETS_.webp`, alt: "Celestia chalets and residential development exterior view" },
  { src: `${R2}/CHALETS_.webp`, alt: "Celestia development landscape and architecture" },
  { src: `${R2}/CHALETS_.webp`, alt: "Celestia project chalet detail" },
];

const eastLegonImages = [
  { src: `${R2}/east-legon-townhouses2.webp`, alt: "East Legon Trio townhouses development" },
  { src: `${R2}/east-legon-townhouses2.webp`, alt: "East Legon Trio townhouse exterior" },
  { src: `${R2}/east-legon-townhouses2.webp`, alt: "East Legon Trio project view" },
];

const tabs = [
  { id: "celestia" as const, label: "Celestia" },
  { id: "east-legon" as const, label: "East Legon Trio" },
];

export default function Portfolio() {
  const [activeTab, setActiveTab] = useState<"celestia" | "east-legon">("celestia");
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  const images = activeTab === "celestia" ? celestiaImages : eastLegonImages;

  const openLightbox = useCallback((src: string, alt: string) => {
    setLightbox({ src, alt });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/portfolio" />
      <main className="pt-20">
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
          <img
            alt="Brownstone Construction portfolio of luxury developments"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
          <div className="relative z-10 text-center px-10">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
              Excellence in Craftsmanship
            </span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black mb-6 font-serif">
              Our Portfolio
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
        </section>

        <section className="px-10 py-16 lg:px-40 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-earthy text-3xl font-bold leading-tight mb-6 uppercase tracking-tight font-serif">
                Defining the future of{" "}
                <span className="text-primary">sustainable living.</span>
              </h2>
              <p className="text-grey text-lg font-light leading-relaxed max-w-xl">
                A curated selection of high-end residential estates,
                award-winning community centers, and carbon-neutral
                infrastructure.
              </p>
            </div>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg bg-background-light border border-grey/30 h-12 px-6 text-earthy text-sm font-bold tracking-tight hover:bg-white transition-all"
            >
              <FaIcon name="download" className="text-lg" />
              <span>Project Catalog</span>
            </button>
          </div>

          <div className="flex gap-4 p-4 border-b border-grey/10 mb-12 items-center">
            <span className="text-xs font-black uppercase tracking-widest text-grey mr-4">
              Filter By:
            </span>
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex h-10 shrink-0 items-center justify-center rounded-full px-6 text-xs font-bold uppercase tracking-widest transition-all ${
                  activeTab === id
                    ? "bg-primary text-white"
                    : "bg-background-light border border-grey/20 text-earthy hover:border-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map(({ src, alt }, i) => (
              <button
                key={`${activeTab}-${i}`}
                type="button"
                className="relative block w-full overflow-hidden rounded-xl bg-gray-100 shadow-xl transition-all hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                onClick={() => openLightbox(src, alt)}
              >
                <img
                  alt={alt}
                  src={src}
                  className="w-full min-h-[280px] object-cover transition-transform duration-300 hover:scale-105"
                />
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="View image full size"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 flex size-12 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close"
          >
            <span className="text-2xl leading-none" aria-hidden>×</span>
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-h-[90vh] max-w-full w-auto object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
