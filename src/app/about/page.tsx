import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";

export default function About() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/about" />
      <main className="pt-14 sm:pt-16 md:pt-20">
        {/* Hero */}
        <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] w-full overflow-hidden flex flex-col justify-center">
          <div className="absolute inset-0 z-0">
            <img
              src="https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main/MAIN-ENTRANCE-townhouse3.webp"
              alt="Brownstone Construction main entrance and townhouse development"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/50 z-10" />
          </div>
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 py-16 min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh]">
            <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight font-serif mb-4 sm:mb-6">
              Crafting Legacies in <br />
              <span className="text-primary italic">Modern Stone</span>
            </h1>
            <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-2xl font-light leading-relaxed mb-6 sm:mb-8 px-2">
              Merging historic craftsmanship with visionary architecture to
              build the sustainable luxury of tomorrow.
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              <Link
                href="/about#vision"
                className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-base hover:scale-105 transition-transform"
              >
                Our Vision
              </Link>
              <Link
                href="/about#heritage"
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-3 rounded-lg font-bold text-base hover:bg-white/20 transition-all"
              >
                Heritage
              </Link>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section id="vision" className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24 text-center">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-4 block">
            Our Purpose
          </span>
          <h2 className="text-earthy text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-serif mb-6 md:mb-8">
            To redefine luxury through the <br /> lens of sustainability.
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8" />
          <p className="text-grey text-xl leading-relaxed max-w-3xl mx-auto italic">
            &quot;Every structure we build must honor its heritage while
            protecting the environment for future generations. We don&apos;t
            just construct buildings; we curate experiences that endure.&quot;
          </p>
        </section>

        {/* Impact */}
        <section className="bg-[#181311] py-20 px-4">
          <div className="max-w-[1200px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12">
            {[
              { icon: "recycle" as const, value: "100%", label: "Sustainable Sourcing" },
              { icon: "scroll" as const, value: "2+", label: "Years of Excellence" },
              { icon: "city" as const, value: "50+", label: "Iconic Projects" },
            ].map(({ icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center text-white p-8 border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                <FaIcon name={icon} className="text-primary text-5xl mb-4" />
                <h3 className="text-4xl font-black mb-2 font-serif">{value}</h3>
                <p className="text-gray-400 uppercase tracking-widest text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* History Timeline */}
        <section id="heritage" className="py-16 md:py-24 px-4 sm:px-6 bg-background-light relative">
          <div className="max-w-[1000px] mx-auto w-full">
            <div className="mb-10 md:mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif mb-2 text-earthy">
                Our Heritage
              </h2>
              <p className="text-grey text-sm sm:text-base">A journey through time, brick by brick.</p>
            </div>
            <div className="flex justify-center items-center my-10 md:my-20">
              <Image
                src="/BrownStone.png"
                alt="Brownstone Construction Limited"
                width={130}
                height={39}
                className="w-24 md:w-32 h-auto object-contain"
              />
            </div>
            <div className="relative border-l-2 border-primary/30 ml-2 sm:ml-4 pl-6 sm:pl-10">
              {[
                {
                  year: "2024",
                  title: "The Foundation",
                  desc: "Brownstone Construction Limited was founded in Accra, Ghana, with a commitment to sustainable, luxury urban development and precision engineering across Africa.",
                },
                {
                  year: "2025",
                  title: "Celestia",
                  desc: "Completed one of our major projects, Celestia—a landmark development that embodies our vision for sustainable, world-class infrastructure and community-focused design.",
                },
              ].map(({ year, title, desc }) => (
                <div key={year} className="mb-12 md:mb-16 relative">
                  <div className="absolute -left-[9px] top-0 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary ring-4 ring-primary/20" />
                  <div>
                    <span className="text-primary font-black text-xl sm:text-2xl font-serif block mb-1 sm:mb-2">
                      {year}
                    </span>
                    <h4 className="text-lg sm:text-xl font-bold text-earthy mb-1 sm:mb-2">{title}</h4>
                    <p className="text-grey text-sm sm:text-base leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership & Team */}
        <section className="py-24 px-6 sm:px-10 bg-white">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-12">
              <span className="text-primary font-bold uppercase tracking-[0.2em] text-xs mb-2 block">
                Our Team
              </span>
              <h2 className="text-4xl font-bold font-serif text-earthy">
                The Visionaries
              </h2>
            </div>

            {/* Leadership: CEO + PA with vertical connector */}
            <div className="flex flex-col items-center mb-16">
              <div className="w-full max-w-sm rounded-xl border border-earthy/10 bg-white overflow-hidden shadow-sm text-center">
                <div className="aspect-[3/4] bg-earthy/5 overflow-hidden">
                  <img
                    src="https://placehold.co/400x533/e8e6e3/181311?text=FYA&font=serif"
                    alt="Francis Yeboah Awuah"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-earthy text-xl font-bold font-serif">Francis Yeboah Awuah</h3>
                  <p className="text-primary text-sm font-semibold mt-1">Managing Director / CEO</p>
                </div>
              </div>
              <div className="w-px h-8 sm:h-10 bg-earthy/20 my-0" aria-hidden />
              <div className="w-full max-w-sm rounded-xl border border-earthy/10 bg-white overflow-hidden shadow-sm text-center">
                <div className="aspect-[3/4] bg-earthy/5 overflow-hidden">
                  <img
                    src="https://placehold.co/400x533/e8e6e3/181311?text=CB&font=serif"
                    alt="Dr. Candace Baker"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-earthy text-xl font-bold font-serif">Dr. Candace Baker</h3>
                  <p className="text-grey text-sm font-semibold mt-1">Personal Assistant to CEO</p>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="border-0 border-t border-earthy/15 mb-14" />

            {/* Management & Operations Team */}
            <h3 className="text-earthy text-2xl sm:text-3xl font-bold font-serif mb-3">
              Management & Operations Team
            </h3>
            <p className="text-grey text-base max-w-2xl mb-10">
              Our team engineers strategy, operations, creativity, and business growth across all
              projects.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              {[
                { name: "Mahlon Clottey", role: "Creative Developer", placeholder: "https://placehold.co/96x96/e8e6e3/181311?text=MC&font=serif" },
                { name: "Batista Simons", role: "Creative Designer", placeholder: "https://placehold.co/96x96/e8e6e3/181311?text=BS&font=serif" },
                { name: "Stacey Sodokeh", role: "Office Manager", placeholder: "https://placehold.co/96x96/e8e6e3/181311?text=SS&font=serif" },
              ].map(({ name, role, placeholder }) => (
                <div
                  key={name}
                  className="rounded-xl border border-earthy/10 bg-white overflow-hidden shadow-sm text-center max-w-[200px] mx-auto sm:mx-0"
                >
                  <div className="w-24 h-24 mx-auto mt-4 rounded-lg bg-earthy/5 overflow-hidden">
                    <img
                      src={placeholder}
                      alt={name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-earthy text-sm font-bold font-serif leading-tight">{name}</h4>
                    <p className="text-grey text-xs font-semibold mt-0.5">{role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 text-center bg-background-light">
          <div className="max-w-4xl mx-auto border-2 border-primary/20 p-16 rounded-[2rem] relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/5 rounded-full" />
            <h2 className="text-4xl font-bold font-serif mb-6 text-earthy">
              Ready to build your masterpiece?
            </h2>
            <p className="text-base sm:text-lg text-grey mb-8 md:mb-10">
              Join us in creating the next landmark of sustainable luxury.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-primary text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-primary/30 transition-all"
              >
                Start a Project
              </Link>
              <Link
                href="/portfolio"
                className="bg-[#181311] text-white px-10 py-4 rounded-xl font-bold hover:opacity-90 transition-all"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
