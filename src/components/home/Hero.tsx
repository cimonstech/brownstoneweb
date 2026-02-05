import WhyBrownstone from "./WhyBrownstone";

export default function Hero() {
  return (
    <section className="pt-40 lg:pt-52 pb-32 lg:pb-44 px-8 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-start">
          <div className="space-y-16 lg:space-y-20">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark-brown leading-[1.1] tracking-tight">
              Reinventing Africa&apos;s Future, Brick by Brick
            </h1>
            <WhyBrownstone />
          </div>
          <div className="space-y-6 lg:space-y-8">
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-grey/10 bg-neutral-light">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80"
                alt="Brownstone construction - modern development"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden border border-grey/10 bg-neutral-light">
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80"
                alt="Brownstone construction - sustainable building"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
