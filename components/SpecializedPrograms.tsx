import React from 'react';
import { BookOpen, TrendingUp, Sun, Heart, Mic, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

const SpecializedPrograms: React.FC = () => {
  const programs = [
    {
      title: "Academic Excellence",
      icon: <BookOpen size={28} />,
      color: "from-blue-500 to-indigo-600",
      items: [
        "Mastering Research & Thesis Writing",
        "PhD Defense Preparation",
        "Time & Energy Management",
        "Building Research Networks"
      ]
    },
    {
      title: "Leadership & Growth",
      icon: <TrendingUp size={28} />,
      color: "from-clarisma-gold to-clarisma-orange",
      items: [
        "Strategic Leadership Development",
        "Career Navigation & Goal-Setting",
        "Personal Branding Workshops",
        "Critical Thinking & Innovation"
      ]
    },
    {
      title: "Well-being & Resilience",
      icon: <Sun size={28} />,
      color: "from-emerald-500 to-teal-600",
      items: [
        "Mindfulness & Resilience Retreats",
        "Self-Esteem & Confidence Building",
        "Emotional Intelligence Training",
        "Stress Management Techniques"
      ]
    },
    {
      title: "Women's Empowerment",
      icon: <Heart size={28} />,
      color: "from-rose-500 to-pink-600",
      items: [
        "Feminist Leadership Training",
        "Women's Empowerment Toolbox",
        "Support Networks & Advocacy",
        "Community Engagement Programs"
      ]
    },
    {
      title: "Professional Skills",
      icon: <Mic size={28} />,
      color: "from-violet-500 to-purple-600",
      items: [
        "Public Speaking Mastery",
        "Interview & Application Coaching",
        "Networking for Success",
        "Presentation Skills Boost"
      ]
    },
    {
      title: "Equity & Inclusion",
      icon: <Scale size={28} />,
      color: "from-orange-500 to-red-600",
      items: [
        "Diversity & Inclusion Training",
        "Legal Literacy Seminars",
        "Workplace Equity Workshops",
        "Rights & Responsibilities Education"
      ]
    }
  ];

  return (
    <section id="programs" className="py-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-clarisma-gold/5 rounded-full blur-[150px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-xs font-bold uppercase tracking-widest mb-6">
              Curated Excellence
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6">
              SPECIALIZED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">PROGRAM</span> <br />
              AREAS.
            </h2>
          </div>
          <p className="text-slate-400 text-lg max-w-sm border-l-2 border-clarisma-gold/30 pl-6 py-2">
            Comprehensive offerings delivered via workshops, virtual sessions, retreats, and hybrid models.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.map((program, index) => (
            <div 
              key={index}
              className="group relative glass-card p-10 rounded-[3rem] border border-white/5 hover:border-clarisma-gold/20 transition-all duration-500 flex flex-col h-full"
            >
              {/* Oversized Number Background */}
              <span className="absolute top-6 right-10 text-8xl font-black text-white/[0.03] group-hover:text-clarisma-gold/[0.05] transition-colors duration-500 select-none">
                0{index + 1}
              </span>

              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center text-white shadow-xl mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  {program.icon}
                </div>
                
                <h3 className="text-2xl font-black text-white mb-6 group-hover:text-clarisma-gold transition-colors">
                  {program.title}
                </h3>

                <ul className="space-y-4">
                  {program.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 group/item">
                      <div className="w-1.5 h-1.5 rounded-full bg-clarisma-gold/40 mt-2 group-hover/item:bg-clarisma-gold transition-colors" />
                      <span className="text-slate-400 text-sm font-medium leading-snug group-hover/item:text-slate-200 transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-10">
                <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-clarisma-gold transition-colors">
                  Explore Module <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecializedPrograms;