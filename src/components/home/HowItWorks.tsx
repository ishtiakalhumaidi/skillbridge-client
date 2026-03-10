import { Search, CalendarCheck, Trophy } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      id: 1,
      title: "Find a Tutor",
      description: "Search by subject, review profiles, and check out tutor ratings to find your perfect match.",
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      id: 2,
      title: "Book a Time",
      description: "View the tutor's live availability and instantly lock in a time slot that works for your schedule.",
      icon: <CalendarCheck className="h-8 w-8 text-primary" />,
    },
    {
      id: 3,
      title: "Start Learning",
      description: "Connect with your tutor, achieve your goals, and leave a review to help others on their journey.",
      icon: <Trophy className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold tracking-tight">How SkillBridge Works</h2>
          <p className="text-muted-foreground max-w-[700px] text-lg">
            Your journey to mastering a new skill is just three simple steps away.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
          
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center space-y-6 relative group">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-background border shadow-xl shadow-primary/5 group-hover:-translate-y-2 transition-transform duration-300">
                {step.icon}
              </div>
              <div className="space-y-3 px-2">
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}