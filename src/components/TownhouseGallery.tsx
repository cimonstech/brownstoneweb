"use client";

import { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import Image from "next/image";
import { FaIcon } from "@/components/Icons";

type GalleryImage = { src: string; alt: string };

const SCROLL_RANGE_VH = 50; // vertical scroll (vh) that drives full horizontal gallery scroll

export default function TownhouseGallery({ images }: { images: GalleryImage[] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [maxScrollX, setMaxScrollX] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i <= 0 ? images.length - 1 : i - 1));
  }, [images.length]);
  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i >= images.length - 1 ? 0 : i + 1));
  }, [images.length]);

  // Measure strip width vs viewport to get max horizontal scroll
  const measure = useCallback(() => {
    if (!stripRef.current || !viewportRef.current) return;
    const stripWidth = stripRef.current.scrollWidth;
    const viewportWidth = viewportRef.current.clientWidth;
    setMaxScrollX(Math.max(0, stripWidth - viewportWidth));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    if (stripRef.current) ro.observe(stripRef.current);
    return () => ro.disconnect();
  }, [measure, images.length]);

  useEffect(() => {
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section || maxScrollX <= 0) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const scrollRangePx = (SECTION_HEIGHT_VH / 100) * window.innerHeight;
      const scrollY = window.scrollY;
      const progress = Math.max(0, Math.min(1, (scrollY - sectionTop) / scrollRangePx));
      setScrollOffset(progress * maxScrollX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [maxScrollX]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, goPrev, goNext]);

  return (
    <>
      {/* Scroll-linked horizontal gallery: no scrollbar, vertical scroll drives horizontal movement */}
      <section
        ref={sectionRef}
        className="relative w-full"
        style={{ height: `${SECTION_HEIGHT_VH}vh` }}
        aria-label="Townhouse gallery"
      >
        <div
          className="sticky top-0 left-0 w-full flex items-center"
          style={{ height: `${SECTION_HEIGHT_VH}vh` }}
        >
          <div
            ref={viewportRef}
            className="w-full flex items-center overflow-hidden flex-1 min-h-0"
            style={{ height: "100%" }}
          >
            <div
              ref={stripRef}
              className="flex gap-4 sm:gap-6 min-w-max transition-transform duration-150 ease-out will-change-transform"
              style={{ transform: `translateX(-${scrollOffset}px)` }}
            >
              {images.map((img, index) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => {
                    setCurrentIndex(index);
                    setLightboxOpen(true);
                  }}
                  className="relative w-[280px] sm:w-[340px] flex-shrink-0 aspect-[4/3] rounded-lg overflow-hidden bg-earthy/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 640px) 280px, 340px"
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-earthy/5 hover:bg-transparent transition-colors pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <FaIcon name="xmark" className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Previous image"
          >
            <FaIcon name="chevronLeft" className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <div
            className="relative w-full max-w-6xl h-[85vh] mx-14 sm:mx-20"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[currentIndex].src}
              alt={images[currentIndex].alt}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            aria-label="Next image"
          >
            <FaIcon name="chevronRight" className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
            {currentIndex + 1} / {images.length}
          </p>
        </div>
      )}
    </>
  );
}
