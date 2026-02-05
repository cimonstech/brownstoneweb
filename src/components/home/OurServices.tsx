const services = [
  {
    title: "Residential Construction",
    description:
      "We design and build high-quality homes and housing developments tailored to the needs of individuals, families, and investors. Our focus is on functional design, modern finishes, and environmental sustainability.",
  },
  {
    title: "Master-Planned Communities",
    description:
      "Brownstone specializes in building holistic neighborhoods with integrated features such as nurseries, schools, community hospitals, clinics, police posts, retail zones, and green parks.",
  },
  {
    title: "Sustainable & Smart Infrastructure",
    description:
      "We are committed to sustainable development through solar power integration, EV charging stations, water management systems, and agri-tech zones to promote urban farming.",
  },
  {
    title: "Real Estate Investment Development",
    description:
      "We work with investors to develop build-to-sell or build-to-rent projects. Our team handles planning, approvals, development oversight, and sales & marketing support.",
  },
  {
    title: "Project Management & Consultancy",
    description:
      "We provide end-to-end project management services, including planning, budgeting, construction supervision, and upgrading existing developments.",
  },
  {
    title: "Mixed-Use Spaces",
    description:
      "We provide holistic environments where residential living, commerce, and tourism thrive together.",
  },
];

export default function OurServices() {
  return (
    <section className="py-24 lg:py-40 px-6 lg:px-16 bg-neutral-light">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 lg:mb-28 space-y-8">
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-corporate-blue">
            Our Services
          </h2>
          <div className="w-16 h-0.5 bg-primary mx-auto" />
          <p className="text-grey text-lg max-w-2xl mx-auto font-light leading-relaxed">
            At Brownstone Construction Limited, we offer a comprehensive range
            of real estate development and construction services.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-20">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white p-12 lg:p-14 rounded-2xl border border-grey/10 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-serif text-xl lg:text-2xl font-bold text-corporate-blue mb-6">
                {service.title}
              </h3>
              <p className="text-grey font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
