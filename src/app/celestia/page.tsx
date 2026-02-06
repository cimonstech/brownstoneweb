import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Celestia | Luxury Living in Akosombo",
  description:
    "Experience the pinnacle of luxury living in Akosombo by Brownstone Construction. Where luxury finds its true landscape.",
};

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDt2Zh4DGtBYxfl1CvUzcqKsDKGh17LaWy_EfH_PDF0-BY5JxwAXLu2ou-mfAqch7vFYFvMqgtl8tQUGc6eh4YOB1VHZWAzoAIzHjpFZ6AmQeL2tFmOzKUYy3likM9VdeaorF54koY2_r4YzhiUL5sKdOIynl_bRk50wQz95IZJq4e2U-6XzyYshytMXNEF1diGWP63ditWSoJDeNSOuNTAoVFkAuB3ChZKtX_5NLOvAw1xMHWqZ3HAASvoD1IhW2Ola2UZRZAK6YI";
const philosophyImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAVNkF17cG_HSDguMLBsPDJ7irftInlpMOXC3_zmkjStCc6uCe5rOxjfWS468jyzbrfeY9rZiUE4Eqilfm5x9onZm6sKvQB2aCh-BISTnHmjnOdSoRwT8ZkRigLnDkz9e8qTmbevScOK8FmEXmYwxVtUJs_zrZU4e8VIsX3-V8ByLjM7XYIPGRzvyL3UULAKe2slWl2IpYw2ORolJmJjxPLe0alXRyfowa2nJ6HSSzuQOI2J3erNn7pAO3GEY7ENnLb-1qWOo187IA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCHNfUQHwNsxJ5wxmCfNuqvReSHrJ8_bKtDrcFGNsKRXjeshoP2VPnwwDarEuIM5ioGbfSyHqvvAfg6wroPr1LJWRroy4-m-hVsnqeQsfnM9VkW-q4KJ8GQxLolbKNi89Gy5gt7wFPUbSO80E-oZBC8pVcxshRrW1t6Flfru3kDIm34fhgoSu3NSY04EbpGz4e1_5NV61GX9FXjPTvzVUf1dUutg-PK5Kkv-K2YVkzumgO-cqo36bxmSttA-msn4-KlmiOxivKPXVc",
];
const townhomesImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBPqPFcLSoXlsuAQfp2CHFrPT5NW4-6wsXW_mP8O-HSmstKK8vLMLFwW-oE0LLfuJ9nxEHRrPh0eHt2WdIIZpf8qdfGyxpbUZPCKR6a5i4aP00xDFZRgCen2JpK_QOOwEbsM9j5zU9ofWaTaXHPrx7a1K2MW9Gaq6GQS42BqqyfFvq_ckEetRpybCCKO9P6vaIk5uQlODLw4AmZO6hhA5uG1n8CO8iPuiruwwT0fG_UawYncIZjmIeH1OPt5mNEEWdwZ6VZhZShU0g";
const chaletsImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCx1s_HAfBaGalT2mhJM-XQOJ8oXSsv75lbHlq_vhF8fBC8YpH7YcM3UkNsP34dOWzzFrpML5YUANKJo7FW2ZV3eMtN1tBaCTyUbO06YCD8BzcjzeOnoNPZ2op78uEWgVEBTNNaaaK936n835GKDU_L8z8VnfMXsIr9n5aB0ZbGkcsHRoo9vT4Ji0OaXHMPvXDtj-MO68Cp4FvBKCXSkO70h7lNntwThz_InGcxaebfktllNrNTQzGBIzedvXCtHU6Li70ZeHj3Jaw";
const lakehouseImages = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAQ076Wr46W0kiabHsOqSB8PfmUNhmLJZVxm98gtgAdBhgZVzLWt6DW6wKbcqx15aKbiaOYHSw8r4Bd_7ilBUkNTf_gM0UVAVNdHEnXH8Eii5dav2STOwIewocoWFWxadvNAPfTofQlYmvSHpmfQCY255mowgxxBE67TpKeBsXtUPj_10Iu_NpJHKY-ks5lxOXCF0Yx2U2ZA6uP0Oo7c5F_o3OxALexigfx1kwMkE2AWg5T4zy0FbxQILCg0KLdZgrT2ZFBAlTLOLM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBy_zaFjrHbi2BGdJ-CIv_bJVNSuSY4Ah5h5dLtRPr_MEhgMEuwEMcAnT8N-cN_YYBkZquIZqjc3-OhhusU4klBdz3QfuOxSCQrW24B4KwQq-FHXs-ZIMoknI4WDkvGnrHRUAjAfqnLpgpP1AIZUhCYWJLzlPoeZ85eA4JOb-aojbrrJuCuXa8d9qhG3rzaNvzCDiuF7wvxR2xKfBIfVKo4g4pq0GCynkuOq3YXdy9TnG4NLlwTdeVxKLM3WdfTRULIXaZCw9IFIyM",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBX1zdQwCxcjTpvBD1w4KA2RbSCnzK0H0xsgrZ1p-M4tfLG7VE7-rlakEABLlKxcs5G17u-6PMKrzOiqmbR8xgFP71tK2siJdv0N80fO5vmaLbA-v3APdqWKa8RT7fHrzp3RMT3ovHomX2JhoTTMXg-eQHiMOPYJQm7zUW3Kf0bqo1LwBAfAPmkZ0L32NsnKg2dqtDCdRRZC_ZGXrg43pXSaBUCXk_cKWLHgBQ6MgALM25GWLPlOiTRsc9pR2x6Cfr-Z-hb752_flc",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDEfAWvqnvas_9FONMdMzVnR7oY-407plhRiehBwKUqD_EH63Lz7l_TAV0S384hQTfPKTbuNyKZAUnBipKuZ7Bhe_eTHNvzFzV9leQVwexTbzj-GxutyOWeubk0j7a3yNQzSCKcLoc_Ca11V0U1HxwrkscZfJPYMvyYapMoC41VM-jQmtihvqaOvzCyP1JN_tOM5zaeFIZbkMt6PQt8f7N0vpTSJulJHpMCTyYHGJZViOXurIX5tJopaB1B0WBW-T7TmaFCUciN5BI",
];
const mapImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCDEJZ2n32fU4lVY3RqHTafBk8QhnCViWKOFKlptU_oSrGlOqgnviLONBxahGgeJwik8vjOC1ZKMa0BeawVt1Cpq2seuLw97_bSQPcodVTRVXoTOQY6AoP_Bxz7JWZZBX5hnuLrFtqpEqAk3D3g8HEPTsx1G_C02upRLGLQKwfjbKzs4eej9pgNYWDWYX49ybVfM133ck-jdzaqSUXfkRkX2TzowM-d2dYalaRUbIfj7Netx5lQZcNqOGOpRsLw-lb91KfFpj5nrLs";

export default function CelestiaPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-earthy/10 bg-[#f8f6f6]/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/celestia.png"
              alt="Celestia"
              width={40}
              height={40}
              className="h-9 w-9 object-contain"
            />
            <h2 className="text-xl font-bold tracking-widest text-earthy">
              CELESTIA
            </h2>
          </Link>
          <nav className="hidden md:flex items-center gap-10">
            <a
              className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-widest"
              href="#journey"
            >
              The Journey
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-widest"
              href="#residences"
            >
              Residences
            </a>
            <a
              className="text-sm font-semibold hover:text-primary transition-colors uppercase tracking-widest"
              href="#lakehouse"
            >
              The Lakehouse
            </a>
          </nav>
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95"
          >
            Inquire Now
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
            alt="Akosombo Landscape"
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
          <p className="text-white/90 text-lg md:text-2xl font-light mb-10 max-w-2xl mx-auto italic">
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
              <h2 className="text-4xl md:text-6xl font-medium leading-tight text-earthy">
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
                  alt="Luxury home architectural detail"
                  src={philosophyImages[0]}
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-2xl mb-12">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className="h-full w-full object-cover"
                  alt="Interior view of modern living room"
                  src={philosophyImages[1]}
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
                    Starting at $450k
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
                href="/contact"
                className="inline-block bg-primary text-white px-10 py-4 rounded-lg font-bold hover:shadow-xl transition-all mt-6"
              >
                View Amenities
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
              className="flex-1 px-6 py-4 rounded-lg border-2 border-[#f8f6f6] focus:border-primary focus:ring-0 outline-none transition-all text-earthy"
              placeholder="Your Professional Email"
              type="email"
              name="email"
            />
            <button
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

      {/* Footer */}
      <footer className="bg-[#f8f6f6] border-t border-earthy/10 py-16 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <Image
                src="/celestia.png"
                alt="Celestia"
                width={40}
                height={40}
                className="h-9 w-9 object-contain"
              />
              <h2 className="text-xl font-serif font-bold tracking-widest">CELESTIA</h2>
            </Link>
            <p className="text-earthy/60 max-w-sm mb-8">
              Defining luxury through the lens of nature. An exclusive gated
              community in the heart of Akosombo.
            </p>
            <div className="flex gap-4">
              <a
                className="h-10 w-10 flex items-center justify-center rounded-full bg-earthy/10 hover:bg-primary hover:text-white transition-all"
                href="#"
                aria-label="Share"
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontFamily: "Material Symbols Outlined" }}
                >
                  share
                </span>
              </a>
              <a
                className="h-10 w-10 flex items-center justify-center rounded-full bg-earthy/10 hover:bg-primary hover:text-white transition-all"
                href="mailto:info@brownstoneconstruction.com"
                aria-label="Email"
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={{ fontFamily: "Material Symbols Outlined" }}
                >
                  mail
                </span>
              </a>
            </div>
          </div>
          <div>
            <h5 className="font-bold mb-6">Explore</h5>
            <ul className="space-y-4 text-earthy/60">
              <li>
                <a className="hover:text-primary" href="#residences">
                  Master Plan
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="/contact">
                  Investment Benefits
                </a>
              </li>
              <li>
                <a className="hover:text-primary" href="/about">
                  Sustainability
                </a>
              </li>
              <li>
                <Link className="hover:text-primary" href="/contact">
                  Contact Sales
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-serif font-bold mb-6">Location</h5>
            <p className="text-earthy/60 mb-4">
              Akosombo North, Volta Region,
              <br />
              Ghana
            </p>
            <div className="h-32 w-full rounded-lg bg-zinc-200 overflow-hidden mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="w-full h-full object-cover"
                alt="Map location of Celestia, Akosombo, Ghana"
                src={mapImage}
              />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-7xl mt-16 pt-8 border-t border-earthy/5 flex flex-col md:flex-row justify-between text-xs text-earthy/40 uppercase tracking-widest font-bold">
          <p>© 2024 Celestia by Brownstone Construction. All Rights Reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-of-use">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
