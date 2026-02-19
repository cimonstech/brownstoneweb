"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";

import { assetUrl } from "@/lib/assets";

const celestiaImages = [
  { src: assetUrl("MAIN-ENTRANCE-townhouse1-day.webp"), alt: "Celestia main entrance" },
  { src: assetUrl("TOWNHOMEUNIT-portrait.webp"), alt: "Celestia townhome unit" },
  { src: assetUrl("CHALETS_.webp"), alt: "Celestia chalets" },
  { src: assetUrl("celestia_chalet.webp"), alt: "Celestia chalet" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA1.webp"), alt: "Celestia living area" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA3.webp"), alt: "Celestia living area interior" },
  { src: assetUrl("MAIN-ENTRANCE-townhouse2.webp"), alt: "Celestia townhouse exterior" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA5.webp"), alt: "Celestia townhouse living space" },
];

const eastLegonImages = [
  { src: assetUrl("east-legon-townhouses2.webp"), alt: "East Legon Trio townhouses development" },
  { src: assetUrl("east-legon-townhouses3.webp"), alt: "East Legon Trio townhouse exterior" },
  { src: assetUrl("east-legon-townhouses4.webp"), alt: "East Legon Trio project view" },
  { src: assetUrl("EastLegon-3D.webp"), alt: "East Legon Trio" },
  { src: assetUrl("eastlegon-townhouses.webp"), alt: "East Legon Trio townhouses" },
  { src: assetUrl("eastlegon-trio/eastlegon-trio1.webp"), alt: "East Legon Trio development" },
  { src: assetUrl("eastlegon-trio/eastlegon-trio2.webp"), alt: "East Legon Trio project" },
  { src: assetUrl("eastlegon-trio/eastlegon-trio3.webp"), alt: "East Legon Trio view" },
];

const wilmaCrescentImages = [
  { src: assetUrl("WilmaCrescent/wilmacresent1.webp"), alt: "Wilma Crescent development" },
  { src: assetUrl("WilmaCrescent/wilmacresent2.webp"), alt: "Wilma Crescent" },
  { src: assetUrl("WilmaCrescent/wilmacresent3.webp"), alt: "Wilma Crescent project" },
  { src: assetUrl("WilmaCrescent/wilmacresent4.webp"), alt: "Wilma Crescent view" },
  { src: assetUrl("WilmaCrescent/wilmacresent5.webp"), alt: "Wilma Crescent" },
];

const othersImages = [
  { src: assetUrl("Tawiah1.webp"), alt: "Tawiah project" },
  { src: assetUrl("Tawiah2.webp"), alt: "Tawiah project" },
  { src: assetUrl("Tawiah3.webp"), alt: "Tawiah project" },
  { src: assetUrl("Tawiah4.webp"), alt: "Tawiah project" },
  { src: assetUrl("Tawiah5.webp"), alt: "Tawiah project" },
];

const tabs = [
  { id: "celestia" as const, label: "Celestia" },
  { id: "east-legon" as const, label: "East Legon Trio" },
  { id: "wilma-crescent" as const, label: "Wilma Crescent" },
  { id: "others" as const, label: "Others" },
];

const TAB_FROM_PARAM: Record<string, "celestia" | "east-legon" | "wilma-crescent" | "others"> = {
  celestia: "celestia",
  "east-legon": "east-legon",
  "wilma-crescent": "wilma-crescent",
  others: "others",
};

function PortfolioContent() {
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");
  const initialTab = (projectParam && TAB_FROM_PARAM[projectParam]) || "celestia";
  const [activeTab, setActiveTab] = useState<"celestia" | "east-legon" | "wilma-crescent" | "others">(initialTab);
  const [lightbox, setLightbox] = useState<{ src: string; alt: string; index: number } | null>(null);

  useEffect(() => {
    const tab = projectParam && TAB_FROM_PARAM[projectParam];
    if (tab) setActiveTab(tab);
  }, [projectParam]);

  const images =
    activeTab === "celestia"
      ? celestiaImages
      : activeTab === "east-legon"
        ? eastLegonImages
        : activeTab === "wilma-crescent"
          ? wilmaCrescentImages
          : othersImages;

  const openLightbox = useCallback((src: string, alt: string, index: number) => {
    setLightbox({ src, alt, index });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const goPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!lightbox) return;
      const prevIndex = lightbox.index > 0 ? lightbox.index - 1 : images.length - 1;
      const item = images[prevIndex];
      setLightbox({ src: item.src, alt: item.alt, index: prevIndex });
    },
    [lightbox, images]
  );

  const goNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!lightbox) return;
      const nextIndex = lightbox.index < images.length - 1 ? lightbox.index + 1 : 0;
      const item = images[nextIndex];
      setLightbox({ src: item.src, alt: item.alt, index: nextIndex });
    },
    [lightbox, images]
  );

  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/portfolio" />
      <main className="pt-14 sm:pt-16 md:pt-20">
        <section className="relative min-h-[350px] sm:min-h-[450px] md:min-h-[500px] h-[50vh] sm:h-[55vh] md:h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <img
            alt="Brownstone Construction portfolio of luxury developments"
            className="absolute inset-0 w-full h-full object-cover"
            src={assetUrl("WilmaCrescent/wilmacresent1.webp")}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
          <div className="relative z-10 text-center px-4 sm:px-6 md:px-10">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
              Excellence in Craftsmanship
            </span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black mb-6 font-serif">
              Our Portfolio
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
        </section>

        <section className="px-4 sm:px-6 md:px-10 py-12 sm:py-16 lg:px-16 xl:px-24 max-w-[1440px] mx-auto">
          <div className="mb-16">
            <div className="max-w-2xl">
              <h2 className="text-earthy text-2xl sm:text-3xl font-bold leading-tight mb-4 sm:mb-6 uppercase tracking-tight font-serif">
                Defining the future of{" "}
                <span className="text-primary">sustainable living.</span>
              </h2>
              <p className="text-grey text-lg font-light leading-relaxed max-w-xl">
                A curated selection of high-end residential estates,
                award-winning community centers, and carbon-neutral
                infrastructure.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 p-4 border-b border-grey/10 mb-12 items-center">
            <span className="text-xs font-black uppercase tracking-wider text-grey mr-2 sm:mr-4 shrink-0">
              Filter By:
            </span>
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                className={`flex h-9 sm:h-10 items-center justify-center rounded-full px-4 sm:px-6 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest transition-all ${
                  activeTab === id
                    ? "bg-primary text-white"
                    : "bg-background-light border border-grey/20 text-earthy hover:border-primary"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div
            className="columns-1 sm:columns-2 md:columns-3 gap-6"
            style={{ columnGap: "1.5rem" }}
          >
            {images.map(({ src, alt }, i) => (
              <button
                key={`${activeTab}-${i}`}
                type="button"
                className="relative block w-full mb-6 break-inside-avoid overflow-hidden rounded-xl bg-gray-100 shadow-xl transition-all hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 [&>img]:hover:scale-[1.02]"
                onClick={() => openLightbox(src, alt, i)}
              >
                <img
                  alt={alt}
                  src={src}
                  className="w-full h-auto block transition-transform duration-300"
                />
              </button>
            ))}
          </div>

          {activeTab === "celestia" && (
            <div className="mt-12 text-center">
              <Link
                href="/celestia"
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-8 py-3.5 font-bold text-sm uppercase tracking-wider hover:bg-primary/90 transition-all"
              >
                Learn more
                <FaIcon name="arrowRight" className="text-base" />
              </Link>
            </div>
          )}
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

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex size-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <FaIcon name="chevronLeft" className="text-2xl" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:flex size-14 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <FaIcon name="chevronRight" className="text-2xl" />
              </button>
            </>
          )}

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

function PortfolioFallback() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/portfolio" />
      <main className="pt-14 sm:pt-16 md:pt-20">
        <section className="relative min-h-[350px] sm:min-h-[450px] md:min-h-[500px] h-[50vh] sm:h-[55vh] md:h-[60vh] w-full flex items-center justify-center overflow-hidden">
          <img
            alt="Brownstone Construction portfolio of luxury developments"
            className="absolute inset-0 w-full h-full object-cover"
            src={assetUrl("WilmaCrescent/wilmacresent1.webp")}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-brightness-75" />
          <div className="relative z-10 text-center px-4 sm:px-6 md:px-10">
            <span className="text-primary text-xs font-bold uppercase tracking-[0.4em] mb-4 block">
              Excellence in Craftsmanship
            </span>
            <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-black mb-6 font-serif">
              Our Portfolio
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto" />
          </div>
        </section>
        <section className="px-4 sm:px-6 md:px-10 py-12 sm:py-16 lg:px-16 xl:px-24 max-w-[1440px] mx-auto">
          <div className="mb-16">
            <div className="max-w-2xl">
              <h2 className="text-earthy text-2xl sm:text-3xl font-bold leading-tight mb-4 sm:mb-6 uppercase tracking-tight font-serif">
                Defining the future of{" "}
                <span className="text-primary">sustainable living.</span>
              </h2>
              <p className="text-grey text-lg font-light leading-relaxed max-w-xl">
                A curated selection of high-end residential estates,
                award-winning community centers, and carbon-neutral
                infrastructure.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 p-4 border-b border-grey/10 mb-12 items-center">
            <span className="text-xs font-black uppercase tracking-wider text-grey mr-2 sm:mr-4 shrink-0">
              Filter By:
            </span>
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                disabled
                className="flex h-9 sm:h-10 items-center justify-center rounded-full px-4 sm:px-6 text-[11px] sm:text-xs font-bold uppercase tracking-wider sm:tracking-widest bg-background-light border border-grey/20 text-earthy"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="columns-1 sm:columns-2 md:columns-3 gap-6 min-h-[400px]" style={{ columnGap: "1.5rem" }}>
            <div className="w-full h-48 rounded-xl bg-grey/10 animate-pulse mb-6" />
            <div className="w-full h-64 rounded-xl bg-grey/10 animate-pulse mb-6" />
            <div className="w-full h-56 rounded-xl bg-grey/10 animate-pulse mb-6" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function Portfolio() {
  return (
    <Suspense fallback={<PortfolioFallback />}>
      <PortfolioContent />
    </Suspense>
  );
}
