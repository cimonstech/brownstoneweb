import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";
import { assetUrl } from "@/lib/assets";

export default function Home() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/" />
      <main>
        {/* Hero */}
        <section className="relative min-h-[100svh] min-h-[600px] sm:min-h-[700px] h-screen w-full flex flex-col justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img
              src="https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main/lakehouse-wide.webp"
              alt="Brownstone Construction luxury development and modern architecture"
              className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            />
          </div>
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-3xl flex flex-col gap-6 sm:gap-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-12 bg-primary" />
                <span className="text-primary font-bold uppercase tracking-[0.3em] text-sm">
                  Premier Construction
                </span>
              </div>
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight drop-shadow-lg font-serif">
                Redesigning Africa&apos;s <br />
                Future – <span className="text-primary font-light">Brick by Brick</span>
              </h1>
              <p className="text-white/80 text-base sm:text-lg md:text-xl max-w-xl font-light leading-relaxed">
                Leading the transition to sustainable, luxury urban development
                with precision engineering and timeless design.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 pt-4">
                <Link
                  href="/portfolio"
                  className="bg-primary text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-earthy transition-all touch-manipulation"
                >
                  Explore Projects
                  <span className="inline-flex items-center justify-center w-4 h-4 shrink-0" aria-hidden>
                    <FaIcon name="arrowRight" className="w-full h-full" />
                  </span>
                </Link>
                <Link
                  href="/about"
                  className="border border-white/30 text-white backdrop-blur-sm px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg font-bold text-xs sm:text-sm uppercase tracking-widest hover:bg-white/10 transition-all touch-manipulation"
                >
                  Our Philosophy
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-24 px-6 bg-background-light">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <img
                src={assetUrl("TOWNHOMEUNIT-portrait.webp")}
                alt="Brownstone Construction townhome unit portrait – luxury residential development"
                className="aspect-[4/5] w-full object-cover object-center rounded-xl shadow-2xl"
              />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-corporate-blue rounded-xl p-8 flex flex-col justify-center text-white hidden md:flex">
                <FaIcon name="recycle" className="text-4xl mb-4 text-primary" />
                <h4 className="text-xl font-bold leading-tight font-serif">Committed to Green Living</h4>
                <p className="text-sm text-white/70 mt-2">
                  Every brick we lay follows strict eco-friendly protocols.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-4">
                <div className="h-[1px] w-8 bg-primary" />
                <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">
                  Unmatched Heritage
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-earthy leading-tight font-serif">
                Who We Are
              </h2>
              <p className="text-lg text-earthy/70 leading-relaxed font-light">
                Brownstone Construction Limited is dedicated to luxury,
                sustainability, and precision in every structure we build. We
                blend sophisticated design with industrial reliability, ensuring
                that our developments serve generations.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 pt-6">
                {[
                  { icon: "gem" as const, title: "Luxury", desc: "High-end materials and finishes curated globally." },
                  { icon: "leaf" as const, title: "Sustainability", desc: "Eco-friendly construction practices and LEED standards." },
                  { icon: "ruler" as const, title: "Precision", desc: "Exact engineering and master craftsmanship." },
                ].map(({ icon, title, desc }) => (
                  <div key={title} className="flex flex-col gap-4">
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl">
                      <FaIcon name={icon} />
                    </div>
                    <h3 className="font-bold text-lg">{title}</h3>
                    <p className="text-sm text-earthy/60">
                      {title === "Sustainability" ? (
                        <>
                          Eco-friendly construction practices and{" "}
                          <a
                            href="https://usgbc.org/leed"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-medium underline hover:no-underline"
                          >
                            LEED
                          </a>{" "}
                          standards.
                        </>
                      ) : (
                        desc
                      )}
                    </p>
                  </div>
                ))}
              </div>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-bold text-primary uppercase tracking-widest text-xs hover:gap-4 transition-all"
              >
                Learn more about our legacy <FaIcon name="arrowRight" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="flex flex-col gap-4 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="h-[1px] w-8 bg-primary" />
                  <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs">
                    The Collection
                  </span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-earthy font-serif">Featured Projects</h2>
                <p className="text-earthy/60 font-light">
                  Explore our award-winning portfolio of high-end residences and
                  commercial spaces across the continent.
                </p>
              </div>
              <Link
                href="/portfolio"
                className="flex items-center gap-2 font-bold uppercase tracking-widest text-xs border-b-2 border-primary pb-2 hover:text-primary transition-all w-fit"
              >
                View All Projects
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
              {[
                { location: "Akosombo", title: "Celestia", href: "/celestia", img: assetUrl("CHALETS_.webp"), alt: "Celestia chalets at Akosombo – luxury residential development" },
                { location: "East Legon", title: "East Legon Trio", href: "/portfolio?project=east-legon", img: assetUrl("east-legon-townhouses2.webp"), alt: "East Legon Trio townhouses – East Legon development" },
                { location: "Adjiringanor", title: "Wilma Crescent", href: "/portfolio?project=wilma-crescent", img: assetUrl("WilmaCrescent/wilmacresent1.webp"), alt: "Wilma Crescent development" },
              ].map(({ location, title, href, img, alt }) => (
                <div
                  key={title}
                  className="group relative overflow-hidden rounded-xl aspect-[4/5] bg-earthy"
                >
                  <img
                    src={img}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-earthy via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <span className="text-primary text-xs font-black uppercase tracking-widest mb-2 block">
                      {location}
                    </span>
                    <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                    <Link
                      href={href}
                      className="bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/20 hover:bg-primary hover:border-primary transition-all inline-block"
                    >
                      Explore
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Brownstone */}
        <section className="py-16 sm:py-20 md:py-24 bg-corporate-blue">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-20 flex flex-col gap-6">
              <span className="text-primary font-bold uppercase tracking-[0.3em] text-xs">
                Why Choose Us
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
                Excellence in Every Detail
              </h2>
              <div className="h-1 w-20 bg-primary mx-auto" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              {[
                { icon: "map" as const, title: "Master Planning", desc: "Integrated urban solutions that harmonize with existing landscapes and cultures." },
                { icon: "check" as const, title: "Quality Assurance", desc: "Rigorous multi-stage inspections ensuring the highest structural integrity." },
                { icon: "bullseye" as const, title: "Smart Integration", desc: "Pioneering IoT-ready buildings with intelligent climate and security systems." },
                { icon: "handshake" as const, title: "Client Partnership", desc: "Transparent communication and collaborative project management from start to end." },
              ].map(({ icon, title, desc }) => (
                <div
                  key={title}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="size-20 rounded-full border-2 border-white/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-500 text-3xl">
                    <FaIcon name={icon} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-3 font-serif">{title}</h4>
                  <p className="text-white/60 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 sm:py-20 md:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-earthy rounded-2xl overflow-hidden flex flex-col lg:flex-row relative">
              <div
                className="absolute inset-0 z-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              />
              <div className="p-8 sm:p-12 lg:p-20 lg:w-3/5 relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight mb-6 sm:mb-8 font-serif">
                  Ready to Build Your <br />
                  <span className="text-primary">Legacy</span>?
                </h2>
                <p className="text-white/70 text-base sm:text-lg mb-8 sm:mb-12 font-light max-w-xl">
                  Consult with our team of lead architects and project managers to
                  bring your vision to life. We specialize in turn-key luxury
                  developments across Africa.
                </p>
                <div className="flex flex-wrap gap-6">
                  <Link
                    href="/contact"
                    className="bg-primary text-white px-10 py-5 rounded-lg font-black uppercase tracking-[0.2em] text-sm hover:translate-y-[-2px] hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    Book a Consultation
                  </Link>
                  <div className="flex items-center gap-4 text-white">
                    <div className="size-12 rounded-full border border-white/20 flex items-center justify-center">
                      <FaIcon name="phone" className="text-xl" />
                    </div>
                    <div>
                      <p className="text-xs text-white/50 uppercase font-bold">
                        Call Us Direct
                      </p>
                      <a href="tel:+233244028773" className="font-bold hover:text-primary transition-colors">+233 244 028 773</a>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="lg:w-2/5 min-h-[250px] sm:min-h-[300px] bg-cover bg-center grayscale hover:grayscale-0 transition-all duration-1000"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80')",
                }}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
