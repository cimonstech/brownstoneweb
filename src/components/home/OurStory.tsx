import Link from "next/link";

export default function OurStory() {
  return (
    <section className="py-32 lg:py-48 px-8 lg:px-20 bg-white">
      <div className="max-w-3xl mx-auto text-center space-y-14">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-corporate-blue">
          Our Story
        </h2>
        <div className="w-16 h-0.5 bg-primary mx-auto" />
        <p className="text-grey text-lg lg:text-xl font-light leading-relaxed">
          Brownstone Construction Limited is a Ghana-based property development
          and construction company committed to delivering high-quality,
          sustainable, and community-focused housing solutions. Founded in 2024,
          Brownstone was established in response to the growing demand for
          modern, thoughtfully designed living spaces in Ghana&apos;s expanding
          urban and peri-urban areas.
        </p>
        <Link
          href="/about"
          className="inline-block bg-primary text-white px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
        >
          Read More
        </Link>
      </div>
    </section>
  );
}
