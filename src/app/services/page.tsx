import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";
import type { IconName } from "@/components/Icons";

const services: { icon: IconName; title: string; desc: string; link: string }[] = [
  {
    icon: "house",
    title: "Residential Construction",
    desc: "Design and build high-quality homes and developments tailored for luxury and longevity. We specialize in creating private sanctuaries that reflect the unique lifestyle of our clients.",
    link: "Discover More",
  },
  {
    icon: "city",
    title: "Master-Planned Communities",
    desc: "Holistic neighbourhoods with schools, clinics, retail and parks, designed for social connectivity and resilience. We don't just build structures; we cultivate thriving ecosystems.",
    link: "Explore Projects",
  },
  {
    icon: "recycle",
    title: "Sustainable Infrastructure",
    desc: "Solar, EV charging, and water management. Engineering the backbone of modern society with a focus on smart technologies and eco-conscious zones for a greener tomorrow.",
    link: "View Sustainability",
  },
  {
    icon: "handshake",
    title: "Real Estate Development",
    desc: "Build-to-sell or build-to-rent projects with investor support. We transform visionary blueprints into profitable assets through meticulous market analysis and development.",
    link: "Investor Relations",
  },
  {
    icon: "map",
    title: "Project Management",
    desc: "End-to-end planning, budgeting and delivery services. Precision oversight from inception to completion, ensuring every detail meets our uncompromising standards.",
    link: "Our Methodology",
  },
  {
    icon: "ruler",
    title: "Mixed-Use Spaces",
    desc: "Dynamic environments where residential living, commerce, and tourism thrive in harmony. We create urban centers that define the character of growing cities.",
    link: "Portfolio Highlights",
  },
];

export default function Services() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/services" />
      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Hero - same structure as About / Contact */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80')`,
            }}
          />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
              Excellence in Development
            </span>
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight font-serif mb-4 sm:mb-6">
              Our Services
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto mb-8" />
            <p className="text-white/90 text-lg md:text-xl max-w-2xl font-light leading-relaxed">
              Brownstone Construction Firm — Building Africa&apos;s Future, Brick by Brick.
            </p>
          </div>
        </section>

        {/* Intro - same pattern as other pages */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-background-light">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-earthy font-serif text-3xl md:text-4xl font-bold mb-6">
              Bespoke Solutions
            </h2>
            <div className="w-16 h-0.5 bg-primary mx-auto mb-6" />
            <p className="text-grey text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Crafting sustainable landmarks through precision engineering and
              visionary architecture. Our approach balances luxury aesthetics
              with functional excellence.
            </p>
          </div>

          {/* Service cards - same card style as Home (rounded, border, spacing) */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
            {services.map(({ icon, title, desc, link }) => (
              <div
                key={title}
                className="bg-white p-10 lg:p-12 rounded-2xl border border-grey/10 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FaIcon name={icon} />
                </div>
                <h3 className="text-earthy font-serif text-xl lg:text-2xl font-bold mb-4">
                  {title}
                </h3>
                <p className="text-grey font-light leading-relaxed mb-6">
                  {desc}
                </p>
                <Link
                  href="/portfolio"
                  className="inline-flex items-center gap-2 font-bold text-primary uppercase tracking-widest text-xs hover:gap-3 transition-all"
                >
                  {link}
                  <FaIcon name="arrowRight" className="text-sm" />
                </Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
