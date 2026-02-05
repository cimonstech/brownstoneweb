export default function WhyBrownstone() {
  const points = [
    "Full-scale real estate development: design & build community infrastructure.",
    "Sustainable systems: solar, EV charging, water management.",
    "Local empowerment with global standards.",
  ];

  return (
    <div className="border border-grey/20 rounded-xl p-8 lg:p-10 bg-white shadow-sm">
      <h3 className="text-primary font-serif text-xl lg:text-2xl font-bold mb-8">
        Why Brownstone?
      </h3>
      <ul className="space-y-6">
        {points.map((text, i) => (
          <li key={i} className="flex gap-4 text-grey font-light leading-relaxed">
            <span className="text-primary mt-1.5 shrink-0">—</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
