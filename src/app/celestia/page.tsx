import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Celestia | Luxury Living in Akosombo",
  description:
    "Experience the pinnacle of luxury living in Akosombo by Brownstone Construction. Where luxury finds its true landscape.",
};

const R2_BASE = "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main";

const heroImage = `${R2_BASE}/MAIN-ENTRANCE-townhouse1-day.webp`;
const philosophyImages = [
  `${R2_BASE}/BrownStone%20Celestia-Riverside-House.jpeg`,
  `${R2_BASE}/celestia-townhouse-LIVING-AREA1.webp`,
];
const townhomesImage = `${R2_BASE}/TOWNHOMEUNIT-portrait.webp`;
const chaletsImage = `${R2_BASE}/CHALET-UNIT-PERSPECTIVE_DAY.webp`;
const lakehouseImages = [
  `${R2_BASE}/lakehouse/LAKEHOUSE_LIVING-AREA.webp`,
  `${R2_BASE}/lakehouse/LAKEHOUSE-GYM.webp`,
  `${R2_BASE}/lakehouse/LAKEHOUSE-BATHROOM.webp`,
  `${R2_BASE}/lakehouse/LAKEHOUSE_LIVING-AREA3.webp`,
];
export default function CelestiaPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      <Nav activePath="/portfolio" />

      {/* Hero */}
      <section className="relative min-h-[100svh] min-h-[600px] sm:min-h-[700px] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(rgba(0,0,0,0.4), rgba(65, 22, 0, 0.6))",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt="Akosombo main entrance"
            className="h-full w-full object-cover scale-105"
            src={heroImage}
          />
        </div>
        <div className="relative z-20 text-center px-4 max-w-5xl">
          <h1
            className="text-white text-3xl md:text-5xl font-serif font-medium leading-tight mb-6"
            style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
          >
            CELESTIA: Where Luxury Finds Its True Landscape
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-8 sm:mb-10 max-w-2xl mx-auto italic px-2">
            Experience the pinnacle of luxury living in Akosombo by Brownstone
            Construction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#residences"
              className="bg-primary text-white px-10 py-4 rounded-lg font-bold text-lg hover:shadow-2xl transition-all text-center"
            >
              View Residences
            </a>
            <a
              href="#lakehouse"
              className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-white/20 transition-all text-center"
            >
              Virtual Tour
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <span
            className="material-symbols-outlined text-white text-4xl font-extralight"
            style={{ fontFamily: "Material Symbols Outlined" }}
          >
            expand_more
          </span>
        </div>
      </section>

      {/* The Journey */}
      <section
        className="py-24 px-6 lg:px-12 bg-white"
        id="journey"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm">
                Our Philosophy
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight text-earthy">
                The Journey from Pressure to Peace
              </h2>
              <p className="text-xl text-earthy/70 leading-relaxed font-light">
                Leave the relentless noise of Accra behind. Celestia is an
                architectural masterpiece designed to harmonise with the dramatic
                topography of the Volta region. Here, space isn&apos;t just a
                luxury—it&apos;s a fundamental state of mind.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="flex flex-col gap-2">
                  <span
                    className="material-symbols-outlined text-primary text-4xl"
                    style={{ fontFamily: "Material Symbols Outlined" }}
                  >
                    air
                  </span>
                  <h4 className="font-serif font-bold text-lg">Pure Air</h4>
                  <p className="text-sm text-earthy/60">
                    Filtered by lush forest canopy.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span
                    className="material-symbols-outlined text-primary text-4xl"
                    style={{ fontFamily: "Material Symbols Outlined" }}
                  >
                    energy_savings_leaf
                  </span>
                  <h4 className="font-bold text-lg">Natural Flow</h4>
                  <p className="text-sm text-earthy/60">
                    Passive cooling architecture.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 h-[600px]">
              <div className="rounded-xl overflow-hidden shadow-2xl mt-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover"
                  alt="Celestia townhome unit"
                  src={philosophyImages[1]}
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl mb-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover"
                  alt="Celestia riverside house"
                  src={philosophyImages[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Residences */}
      <section
        className="py-24 px-6 lg:px-12 bg-[#f8f6f6]"
        id="residences"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6">
              Architectural Excellence
            </h2>
            <p className="text-earthy/60 max-w-2xl mx-auto">
              Two distinct living experiences, one unified standard of luxury.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative bg-white rounded-xl overflow-hidden shadow-xl transition-all hover:-translate-y-2">
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Terraced townhomes in mountain setting"
                  src={townhomesImage}
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-medium">Terraced Townhomes</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Inquire for details
                  </span>
                </div>
                <p className="text-earthy/70 mb-6 leading-relaxed">
                  Sophisticated 3-bedroom residences with mountain views and
                  tiered garden terraces. Designed for the modern family.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Floor-to-ceiling panoramic glass",
                    "Private rooftop infinity pools",
                    "Smart-home automation ready",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-primary text-xl"
                        style={{ fontFamily: "Material Symbols Outlined" }}
                      >
                        done
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="block w-full py-4 border border-earthy/20 rounded-lg font-bold hover:bg-earthy hover:text-white transition-all text-center"
                >
                  Explore Details
                </Link>
              </div>
            </div>
            <div className="group relative bg-white rounded-xl overflow-hidden shadow-xl transition-all hover:-translate-y-2">
              <div className="aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt="Private luxury chalets in nature"
                  src={chaletsImage}
                />
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-3xl font-serif font-medium">Private Chalets</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Bespoke Only
                  </span>
                </div>
                <p className="text-earthy/70 mb-6 leading-relaxed">
                  Bespoke living spaces designed for ultimate privacy and
                  seclusion. Built directly into the mountain face with river
                  access.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Natural local stone finishes",
                    "Private boat mooring available",
                    "Outdoor sunken fire pits",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm">
                      <span
                        className="material-symbols-outlined text-primary text-xl"
                        style={{ fontFamily: "Material Symbols Outlined" }}
                      >
                        done
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="block w-full py-4 border border-earthy/20 rounded-lg font-bold hover:bg-earthy hover:text-white transition-all text-center"
                >
                  Request Brochure
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Lakehouse */}
      <section
        className="py-24 px-6 lg:px-12 bg-earthy text-white"
        id="lakehouse"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rounded-xl h-64 w-full object-cover"
                alt="Luxury spa and wellness area"
                src={lakehouseImages[0]}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rounded-xl h-64 w-full object-cover translate-y-8"
                alt="Modern office co-working space"
                src={lakehouseImages[1]}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rounded-xl h-64 w-full object-cover"
                alt="Modern gym with lake view"
                src={lakehouseImages[2]}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="rounded-xl h-64 w-full object-cover translate-y-8"
                alt="Swimming pool area"
                src={lakehouseImages[3]}
              />
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm">
                The Social Core
              </span>
              <h2 className="text-5xl font-medium leading-tight">
                The Lakehouse
              </h2>
              <p className="text-xl text-white/70 leading-relaxed font-light">
                More than a clubhouse—the Lakehouse is a communal sanctuary. A
                place where high-performance workspaces meet deep wellness
                traditions.
              </p>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontFamily: "Material Symbols Outlined" }}
                    >
                      fitness_center
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg">Elite Wellness</h4>
                    <p className="text-white/60">
                      A state-of-the-art gym, yoga deck, and thermal spa
                      overlooking the river.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-lg text-primary">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontFamily: "Material Symbols Outlined" }}
                    >
                      laptop_mac
                    </span>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg">Deep Work Hub</h4>
                    <p className="text-white/60">
                      Quiet zones and conference rooms for seamless remote
                      executive work.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/celestia/lakehouse"
                className="inline-block bg-primary text-white px-10 py-4 rounded-lg font-bold hover:shadow-xl transition-all mt-6"
              >
                Explore the Lakehouse Experience
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center bg-white">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl md:text-6xl font-medium mb-8">
            Secure Your Piece of Peace
          </h2>
          <p className="text-earthy/60 text-lg mb-12">
            Reservations are now open for Phase 1. Connect with our advisors to
            receive the full prospectus and availability map.
          </p>
          <form
            action="/contact"
            method="get"
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              name="inquiry"
              type="hidden"
              value="Celestia Phase 1"
            />
            <input
              suppressHydrationWarning
              className="flex-1 px-6 py-4 rounded-lg border-2 border-[#f8f6f6] focus:border-primary focus:ring-0 outline-none transition-all text-earthy"
              placeholder="Your Professional Email"
              type="email"
              name="email"
            />
            <button
              suppressHydrationWarning
              type="submit"
              className="bg-primary text-white px-12 py-4 rounded-lg font-bold hover:bg-primary/90 transition-all"
            >
              Inquire Now
            </button>
          </form>
          <p className="mt-6 text-xs text-earthy/40 uppercase tracking-widest">
            A Brownstone Construction Development
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
