import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { FaIcon } from "@/components/Icons";

const projects = [
  { category: "Residential", title: "The Emerald Heights", location: "Lagos, Nigeria", img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80", minH: "min-h-[400px]" },
  { category: "Investment", title: "Crystal Corporate Tower", location: "London, UK", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80", minH: "min-h-[500px]" },
  { category: "Sustainable Infrastructure", title: "Eco-Tech Park", location: "Berlin, Germany", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80", minH: "min-h-[350px]" },
  { category: "Residential", title: "Azure Coastal Villas", location: "Malibu, CA", img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80", minH: "min-h-[450px]" },
  { category: "Community", title: "Urban Art Collective", location: "Paris, France", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80", minH: "min-h-[380px]" },
  { category: "Infrastructure", title: "Silicon Valley Hub", location: "San Jose, CA", img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80", minH: "min-h-[420px]" },
];

export default function Portfolio() {
  return (
    <div className="bg-background-light text-earthy min-h-screen">
      <Nav activePath="/portfolio" />
      <main className="pt-20">
        <section className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
          <img
            alt="Luxury Development"
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

          <div className="flex gap-4 p-4 overflow-x-auto border-b border-grey/10 mb-12 items-center [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-xs font-black uppercase tracking-widest text-grey mr-4 hidden md:block">
              Filter By:
            </span>
            {["All Projects", "Residential", "Community", "Infrastructure", "Investments"].map(
              (label, i) => (
                <button
                  key={label}
                  type="button"
                  className={`flex h-10 shrink-0 items-center justify-center rounded-full px-6 text-xs font-bold uppercase tracking-widest transition-all ${
                    i === 0
                      ? "bg-primary text-white"
                      : "bg-background-light border border-grey/20 text-earthy hover:border-primary"
                  }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 [break-inside:avoid]">
            {projects.map(({ category, title, location, img, minH }) => (
              <div
                key={title}
                className="relative group overflow-hidden rounded-xl bg-gray-100 shadow-xl transition-all hover:shadow-2xl mb-6"
              >
                <img
                  alt={title}
                  src={img}
                  className={`w-full object-cover transition-transform duration-700 group-hover:scale-110 ${minH}`}
                />
                <div className="overlay absolute inset-0 bg-black/70 opacity-0 transition-opacity duration-500 flex flex-col justify-end p-8 group-hover:opacity-100">
                  <span className="text-primary text-xs font-black uppercase tracking-widest mb-2">
                    {category}
                  </span>
                  <h3 className="text-white text-3xl font-bold mb-1 font-serif">{title}</h3>
                  <p className="text-white/70 text-sm mb-6 flex items-center gap-1">
                    <FaIcon name="location" className="mr-1 text-sm" /> {location}
                  </p>
                  <button
                    type="button"
                    className="w-max bg-primary text-white py-3 px-8 rounded font-bold uppercase tracking-tighter text-sm hover:bg-white hover:text-primary transition-all"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center py-20 gap-2">
            <button
              type="button"
              className="flex size-12 items-center justify-center rounded-lg hover:bg-white transition-all border border-transparent hover:border-grey/20"
              aria-label="Previous"
            >
              <FaIcon name="chevronLeft" />
            </button>
            <a
              href="#"
              className="text-sm font-black flex size-12 items-center justify-center text-white rounded-lg bg-primary shadow-lg shadow-primary/20"
            >
              1
            </a>
            <a
              href="#"
              className="text-sm font-semibold flex size-12 items-center justify-center text-earthy rounded-lg hover:bg-white transition-all border border-transparent hover:border-grey/20"
            >
              2
            </a>
            <a
              href="#"
              className="text-sm font-semibold flex size-12 items-center justify-center text-earthy rounded-lg hover:bg-white transition-all border border-transparent hover:border-grey/20"
            >
              3
            </a>
            <span className="text-grey flex size-12 items-center justify-center">...</span>
            <a
              href="#"
              className="text-sm font-semibold flex size-12 items-center justify-center text-earthy rounded-lg hover:bg-white transition-all border border-transparent hover:border-grey/20"
            >
              12
            </a>
            <button
              type="button"
              className="flex size-12 items-center justify-center rounded-lg hover:bg-white transition-all border border-transparent hover:border-grey/20"
              aria-label="Next"
            >
              <FaIcon name="chevronRight" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
