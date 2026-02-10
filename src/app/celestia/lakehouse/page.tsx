import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import JettyLeadForm from "@/components/JettyLeadForm";
import { FaIcon } from "@/components/Icons";

export const metadata = {
  title: "The Lakehouse Experience | Celestia",
  description:
    "Designed for focus, wellness, and connection. Explore workspaces, wellness amenities, and leisure spaces at Celestia Lakehouse.",
};

const R2 = "https://pub-3e7b2072ee7b4288bdc8a3613d022372.r2.dev/main";
const LH = `${R2}/lakehouse`;

const workImages = [
  `${LH}/LAKEHOUSE_LIVING-AREA.webp`,
  `${LH}/CONFERENCE-AREA.webp`,
  `${LH}/WORK-AREA.webp`,
];
const wellnessImages = [
  { src: `${LH}/LAKEHOUSE-GYM.webp`, label: "State-of-the-art gym", title: "Peak Performance" },
  { src: `${LH}/LAKEHOUSE-BATHROOM.webp`, label: "Massage & restoration", title: "Therapeutic Relaxation" },
];
export default function LakehousePage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fdfcfb]">
      <Nav activePath="/celestia/lakehouse" />

      {/* Hero — same height as homepage hero */}
      <section className="relative min-h-[100svh] min-h-[600px] sm:min-h-[700px] h-screen w-full flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[1.2s] ease-out"
            style={{
              backgroundImage: `url(${LH}/lakehouse_frontview.webp)`,
            }}
          />
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(65, 22, 0, 0.2) 0%, rgba(65, 22, 0, 0.65) 100%)",
            }}
          />
        </div>
        <div className="relative z-20 px-6 pt-20">
          <span className="text-white/80 text-xs font-bold tracking-[0.4em] uppercase mb-6 block">
            A Brownstone Legacy
          </span>
          <h1 className="text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[8rem] leading-none font-serif mb-6 sm:mb-8">
            The Lakehouse
          </h1>
          <div className="flex items-center justify-center gap-6 text-white/60">
            <span className="w-12 h-px bg-white/40" />
            <p className="text-[11px] font-bold tracking-[0.5em] uppercase">Volta Lake, Ghana</p>
            <span className="w-12 h-px bg-white/40" />
          </div>
        </div>
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 z-20">
          <span className="text-[9px] font-bold tracking-[0.3em] uppercase">Scroll to Begin</span>
          <div className="w-px h-16 bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </section>

      {/* 1. Work & Productivity */}
      <section className="min-h-screen w-full flex flex-col relative overflow-hidden bg-white">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[90vh]">
          <div className="lg:col-span-5 flex flex-col justify-center px-8 lg:px-24 py-20">
            <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-6">
              Work & Productivity
            </span>
            <h2 className="text-earthy text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 sm:mb-8 leading-tight">
              Elevated Workspaces
            </h2>
            <p className="text-earthy/70 text-lg font-light leading-relaxed max-w-md mb-10">
              Designed for focus, clarity, and inspired productivity.
            </p>
            <ul className="space-y-6 text-earthy/80 font-light">
              <li className="flex gap-3">
                <span className="text-primary font-serif">—</span>
                <span><strong className="text-earthy">Workspaces & Conference Rooms</strong> — Calm, professional environments overlooking nature.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-serif">—</span>
                <span><strong className="text-earthy">Reception Area</strong> — A refined welcome point for residents and guests.</span>
              </li>
            </ul>
          </div>
          <div className="lg:col-span-7 flex gap-2 p-4 sm:p-6 lg:p-8 bg-earthy/[0.02] items-stretch min-h-[300px] sm:min-h-[360px] md:min-h-[420px]">
            {workImages.map((src) => (
              <div
                key={src}
                className="relative overflow-hidden rounded-sm flex-1 min-w-0 group transition-all duration-700 ease-out hover:flex-[2]"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{ backgroundImage: `url(${src})` }}
                />
                <div className="absolute inset-0 bg-earthy/10 transition-all duration-500 group-hover:bg-transparent" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Wellness & Reconnection */}
      <section className="relative min-h-screen w-full flex flex-col overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${LH}/LAKEHOUSE-GYM.webp)` }}
          />
          <div className="absolute inset-0 bg-earthy/50" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col pt-32 pb-20 px-8 lg:px-24">
          <div className="text-center mb-16">
            <h2 className="text-white text-4xl md:text-7xl font-serif mb-2 italic">Wellness</h2>
            <p className="text-white/70 text-[10px] font-bold tracking-[0.5em] uppercase">
              Where wellness becomes part of everyday living.
            </p>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {wellnessImages.map(({ src, label, title }, i) => (
                <div
                  key={src}
                  className={`group relative aspect-[3/4] rounded-sm overflow-hidden bg-white/10 backdrop-blur-md transition-all duration-1000 hover:backdrop-blur-none hover:bg-transparent cursor-default ${
                    i === 1 ? "mt-16 md:mt-32" : ""
                  }`}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    style={{ backgroundImage: `url(${src})` }}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase mb-2 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                      {label}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-serif opacity-0 group-hover:opacity-100 transition-all duration-1000 delay-100 translate-y-4 group-hover:translate-y-0">
                      {title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/60 text-center text-sm max-w-xl mx-auto mt-12">
            Wellness corners for breathing and stretching. Massage rooms for therapeutic relaxation.
          </p>
        </div>
      </section>

      {/* 3. Leisure & Social — warm golden tones */}
      <section className="min-h-screen w-full bg-earthy text-white flex flex-col lg:flex-row">
        <div className="lg:w-1/2 relative overflow-hidden min-h-[50vh] lg:min-h-full">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 hover:scale-100 transition-transform duration-[8s] ease-out"
            style={{ backgroundImage: `url(${R2}/lakehouseIMG_0350.webp)` }}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-20">
          <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-6">
            Leisure & Social Living
          </span>
          <h2 className="text-4xl md:text-6xl font-serif mb-4 leading-tight">
            Moments designed for connection, leisure, and celebration.
          </h2>
          <ul className="space-y-8 mt-10">
            {[
              { label: "Pool & sunset deck lounge", icon: "umbrellaBeach" as const },
              { label: "Bar & social terrace", icon: "martiniGlass" as const },
              { label: "Dining and restaurant spaces", icon: "utensils" as const },
              { label: "Luxury kitchens", icon: "kitchenSet" as const },
              { label: "Private jetty with Volta Lake access", icon: "sailboat" as const },
            ].map(({ label, icon }) => (
              <li key={label} className="flex gap-6 group items-center">
                <span className="text-primary/90 shrink-0">
                  <FaIcon name={icon} className="text-xl" />
                </span>
                <span className="text-white/90 font-light">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. Private Jetty — CTA */}
      <section className="relative min-h-[85vh] w-full flex flex-col justify-center items-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
            style={{ backgroundImage: `url(${R2}/lakehouse-wide.webp)` }}
          />
          <div className="absolute inset-0 bg-earthy/55" />
        </div>
        <div className="relative z-10 text-center text-white px-6 py-20">
          <span className="text-primary text-[10px] font-bold tracking-[0.4em] uppercase mb-6 block">
            Exclusive Access
          </span>
          <h2 className="text-4xl md:text-7xl font-serif mb-6">The Private Jetty</h2>
          <p className="text-white/95 max-w-2xl mx-auto text-lg font-light leading-relaxed mb-12">
            Your direct portal to the Volta. From high-speed water sports to tranquil morning boat drifts, the water is an extension of your home.
          </p>
          <JettyLeadForm />
        </div>
      </section>

      <Footer />
    </div>
  );
}
