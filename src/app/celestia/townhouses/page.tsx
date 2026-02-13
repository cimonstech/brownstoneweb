import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BrochureForm from "@/components/BrochureForm";
import { assetUrl } from "@/lib/assets";

const defaultOgImage = assetUrl("MAIN-ENTRANCE-townhouse1-day.webp");

export const metadata: Metadata = {
  title: "Luxury Townhomes for Sale in Akosombo | Celestia",
  description:
    "2-bedroom luxury townhomes at Celestia Akosombo: Jacuzzis, waterfront, turnkey investment. 90 min from Accra. Phase 1 now open.",
  keywords: [
    "luxury townhomes Akosombo",
    "Celestia townhouses",
    "2-bedroom for sale Ghana",
    "investment property Akosombo",
    "high-yield rental property Ghana",
    "vacation homes Volta",
    "Celestia by Brown Stone",
    "luxury real estate Akosombo",
    "turnkey property Ghana",
  ],
  openGraph: {
    title: "Luxury Townhomes for Sale in Akosombo | Celestia",
    description:
      "2-bedroom luxury townhomes at Celestia Akosombo: private Jacuzzis, waterfront access, high-yield rental potential. Turnkey investment 90 minutes from Accra.",
    images: [{ url: defaultOgImage, alt: "Celestia Akosombo luxury townhouse exterior with modern gabled roof" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luxury Townhomes for Sale in Akosombo | Celestia",
    description:
      "2-bedroom luxury townhomes at Celestia: waterfront, Jacuzzis, turnkey investment. 90 minutes from Accra.",
  },
  alternates: { canonical: "/celestia/townhouses" },
};
const HERO_IMAGE = assetUrl("MAIN-ENTRANCE-townhouse1-day.webp");
const RESIDENCE_IMAGE = assetUrl("celestia-townhouse-LIVING-AREA1.webp");
const WATERFRONT_IMAGE = assetUrl("TOWNHOMEUNIT-portrait.webp");

const GALLERY_IMAGES = [
  { src: assetUrl("celestia-townhouse-LIVING-AREA1.webp"), alt: "Celestia townhouse living area" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA2.webp"), alt: "Celestia townhouse living area" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA3.webp"), alt: "Celestia townhouse living area" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA4.webp"), alt: "Celestia townhouse living area" },
  { src: assetUrl("celestia-townhouse-LIVING-AREA5.webp"), alt: "Celestia townhouse living area" },
  { src: assetUrl("townhouse/celestia-townhouse-BEDROOM1.webp"), alt: "Celestia townhouse bedroom" },
  { src: assetUrl("townhouse/celestia-townhouse-BEDROOM2.webp"), alt: "Celestia townhouse bedroom" },
  { src: assetUrl("townhouse/celestia-townhouse-BEDROOM3.webp"), alt: "Celestia townhouse bedroom" },
];

export default function TownhousesPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fdfcfb]">
      <Nav activePath="/celestia/townhouses" />

      {/* Hero — same height as homepage */}
      <section className="relative min-h-[100svh] min-h-[600px] sm:min-h-[700px] h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[1.2s] ease-out"
            style={{ backgroundImage: `url(${HERO_IMAGE})` }}
          />
          <div
            className="absolute inset-0 z-10"
            style={{
              background:
                "linear-gradient(to bottom, rgba(65, 22, 0, 0.15) 0%, rgba(65, 22, 0, 0.7) 100%)",
            }}
          />
        </div>
        <div className="relative z-20 px-4 sm:px-6 max-w-4xl mx-auto pt-20">
          <span className="text-white/80 text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase mb-4 sm:mb-6 block">
            Celestia · Akosombo
          </span>
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight mb-4 sm:mb-6">
            The Pinnacle of Refined Living in Akosombo
          </h1>
          <p className="text-white/90 text-lg sm:text-xl md:text-2xl font-light leading-relaxed mb-6 sm:mb-8">
            A Statement of Success. A Legacy of Elegance.
          </p>
          <p className="text-white/85 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed mb-10">
            We designed these homes for people who’ve arrived — and who know that real luxury is
            waking up to the lake, not the noise. Just 90 minutes from Accra, modern architecture meets the tranquil beauty of
            Ghana’s Volta; ambition meets serenity. You’ll feel it the moment you step in.
          </p>
          <Link
            href="#viewing"
            className="inline-flex items-center justify-center bg-primary text-white px-8 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
          >
            Secure Your Private Viewing
          </Link>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/40 z-20">
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* The Residence: Effortless Elegance */}
      <section className="w-full flex flex-col lg:flex-row min-h-0">
        <div className="lg:w-1/2 flex flex-col justify-center px-6 sm:px-8 lg:px-16 xl:px-24 py-16 lg:py-24">
          <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-4">
            The Residence
          </span>
          <h2 className="text-earthy text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
            Effortless Elegance
          </h2>
          <p className="text-earthy/80 text-lg font-light leading-relaxed max-w-xl mb-10">
            Every townhouse at Celestia is more than a home; it is a thoughtfully crafted space that
            reflects your progress and aspirations. These two-bedroom ensuite terraced homes feature
            multi-level, open-plan layouts welcoming natural light and sweeping lake views into
            everyday living.
          </p>
          <ul className="space-y-6 text-earthy/85 font-light">
            <li className="flex gap-4">
              <span className="text-primary font-serif shrink-0">—</span>
              <span>
                <strong className="text-earthy">Private Sanctuary:</strong> Every home includes a
                private Jacuzzi — the kind of treat that makes you forget you’re not on holiday.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-serif shrink-0">—</span>
              <span>
                <strong className="text-earthy">Outdoor Living:</strong> Large terraces made for
                morning coffee and sunset drinks. No rush, just the view.
              </span>
            </li>
            <li className="flex gap-4">
              <span className="text-primary font-serif shrink-0">—</span>
              <span>
                <strong className="text-earthy">Premium Craftsmanship:</strong> High-end finishes
                and bright, airy interiors — the kind of quality you notice every day.
              </span>
            </li>
          </ul>
        </div>
        <div className="lg:w-1/2 min-h-[50vh] lg:min-h-[70vh] relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${RESIDENCE_IMAGE})` }}
          />
          <div className="absolute inset-0 bg-earthy/5" />
        </div>
      </section>

      {/* The Waterfront & Lifestyle Experience */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
                Beyond Your Doorstep
              </span>
              <h2 className="text-earthy text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
                The Waterfront & Lifestyle Experience
              </h2>
              <p className="text-earthy/80 text-lg font-light leading-relaxed mb-10">
                At Celestia, luxury extends beyond your doorstep. Residents enjoy exclusive waterfront
                access, providing a direct connection to the serene beauty of the lake.
              </p>
              <ul className="space-y-6 text-earthy/85 font-light">
                <li className="flex gap-4">
                  <span className="text-primary font-serif shrink-0">—</span>
                  <span>
                    <strong className="text-earthy">Nautical Leisure:</strong> Benefit from a private
                    dock for boats and water activities. As a signature privilege, outright buyers
                    receive a complimentary kayak.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary font-serif shrink-0">—</span>
                  <span>
                    <strong className="text-earthy">Health & Wellness:</strong> Maintain your peak
                    performance at our state-of-the-art gym and fitness center or unwind in the
                    community swimming pool.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary font-serif shrink-0">—</span>
                  <span>
                    <strong className="text-earthy">Curated Dining:</strong> Enjoy the convenience
                    of an on-site bar and restaurant, offering a premium social experience without
                    leaving the community.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="text-primary font-serif shrink-0">—</span>
                  <span>
                    <strong className="text-earthy">Sophisticated Events:</strong> Access to premium
                    conference halls and event spaces, designed to meet the standards of Akosombo&apos;s
                    premier hospitality experiences.
                  </span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative aspect-[4/5] lg:aspect-auto lg:min-h-[500px] rounded-lg overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${WATERFRONT_IMAGE})` }}
              />
              <div className="absolute inset-0 bg-earthy/10" />
            </div>
          </div>
        </div>
      </section>

      {/* The Investment: Yield Without Compromise */}
      <section className="w-full bg-earthy/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 lg:py-24">
          <div className="max-w-3xl">
            <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
              The Investment
            </span>
            <h2 className="text-earthy text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
              Yield Without Compromise
            </h2>
          <p className="text-earthy/80 text-lg font-light leading-relaxed mb-10">
            We built Celestia so you don’t have to choose between a place you love and a smart
            investment. High occupancy year-round, tourism and business travel on your doorstep —
            your asset works for you from day one.
          </p>
            <ul className="space-y-6 text-earthy/85 font-light">
              <li className="flex gap-4">
                <span className="text-primary font-serif shrink-0">—</span>
                <span>
                  <strong className="text-earthy">Turnkey Passive Income:</strong> Benefit from
                  consistent rental income from day one, with the potential to recoup your capital
                  within just a few years.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-serif shrink-0">—</span>
                <span>
                  <strong className="text-earthy">Professional Management:</strong> Brownstone
                  provides optional turnkey management services to ensure your property remains a
                  high-performing asset while you are away.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-serif shrink-0">—</span>
                <span>
                  <strong className="text-earthy">Capital Growth:</strong> Prime lakeside location and
                  limited availability guarantee long-term appreciation.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* A Path to Ownership Built on Trust */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 lg:py-24">
          <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-4 block">
            Ownership
          </span>
          <h2 className="text-earthy text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight mb-6">
            A Path to Ownership Built on Trust
          </h2>
          <p className="text-earthy/80 text-lg font-light leading-relaxed max-w-2xl mb-12">
            We offer a transparent and secure pathway to property ownership for local residents, the
            diaspora, and foreign nationals.
          </p>
          <ol className="space-y-8 max-w-2xl">
            <li className="flex gap-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-serif font-semibold shrink-0">
                1
              </span>
              <div>
                <strong className="text-earthy block mb-1">Select Your Unit</strong>
                <span className="text-earthy/80 font-light">
                  Following a site visit or virtual presentation.
                </span>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-serif font-semibold shrink-0">
                2
              </span>
              <div>
                <strong className="text-earthy block mb-1">Reserve Your Future</strong>
                <span className="text-earthy/80 font-light">
                  A $3,000 reservation fee withdraws your selected unit from the market.
                </span>
              </div>
            </li>
            <li className="flex gap-6">
              <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-serif font-semibold shrink-0">
                3
              </span>
              <div>
                <strong className="text-earthy block mb-1">Flexible Terms</strong>
                <span className="text-earthy/80 font-light">
                  Tailored sale and purchase agreements with outright or installment plans.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* CTA — Secure Your Private Viewing */}
      <section
        id="viewing"
        className="relative w-full flex flex-col justify-center items-center overflow-hidden bg-earthy text-white py-20 lg:py-28 px-6"
      >
        <div className="absolute inset-0 z-0 opacity-20">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${assetUrl("celestia-townhouse-LIVING-AREA3.webp")})` }}
          />
        </div>
        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold leading-tight mb-4">
            Secure Your Private Viewing
          </h2>
          <p className="text-white/85 text-lg font-light leading-relaxed mb-6">
            Receive the Celestia Townhouses Brochure by email. When you're ready, reply to that email or contact us to arrange your private viewing.
          </p>
          <div className="w-full max-w-md mx-auto mb-10">
            <BrochureForm
              project="townhouse"
              successMessage="Thank you for your interest. We've sent the Celestia Townhouses Brochure to your email."
              className="[&_input]:bg-white/10 [&_input]:border-white/30 [&_input]:text-white [&_input]:placeholder:text-white/60 [&_label]:text-white/90 [&_a]:text-primary [&_button]:border [&_button]:border-white/40 [&_button]:bg-transparent [&_button]:text-white [&_button:hover]:bg-white [&_button:hover]:text-earthy"
            />
          </div>
          <Link
            href="/contact?interest=townhouses"
            className="inline-flex items-center justify-center bg-primary text-white px-10 py-4 rounded-lg font-bold text-sm uppercase tracking-widest hover:bg-primary/90 transition-all shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
