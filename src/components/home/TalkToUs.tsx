import Link from "next/link";

export default function TalkToUs() {
  return (
    <section className="py-32 lg:py-48 px-8 lg:px-20 bg-white">
      <div className="max-w-3xl mx-auto text-center space-y-14">
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-corporate-blue">
          Talk to Us
        </h2>
        <div className="w-16 h-0.5 bg-primary mx-auto" />
        <p className="text-grey text-lg lg:text-xl font-light leading-relaxed">
          Whether you are planning a new development, investing, or upgrading
          your community infrastructure, our team is ready to support you.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-primary text-white px-10 py-4 rounded-full font-semibold text-sm uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
        >
          Connect Us
        </Link>
      </div>
    </section>
  );
}
