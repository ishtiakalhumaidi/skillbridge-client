export function HowItWorks() {
  const steps = [
    {
      id: "01",
      title: "Discover.",
      description: "Search by subject, review verified profiles, and find the perfect mentor tailored to your learning style.",
    },
    {
      id: "02",
      title: "Schedule.",
      description: "View live availability and instantly lock in a time slot that seamlessly fits your calendar.",
    },
    {
      id: "03",
      title: "Master.",
      description: "Connect in a secure environment, achieve your goals, and leave feedback for the community.",
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-32 border-t border-foreground/10 bg-foreground/5">
      <div className="container mx-auto px-6 md:px-12">
        
        <h2 className="text-5xl md:text-7xl font-head tracking-tighter mb-24 text-center text-foreground">
          Simplicity by design.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-12 max-w-6xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col relative group">
              <div className="text-8xl md:text-9xl font-head tracking-tighter text-foreground/10 mb-8 transition-colors duration-500 group-hover:text-primary/20">
                {step.id}
              </div>
              <h3 className="text-3xl font-bold tracking-tight text-foreground mb-4">
                {step.title}
              </h3>
              <p className="text-lg text-foreground/60 leading-relaxed font-medium">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}