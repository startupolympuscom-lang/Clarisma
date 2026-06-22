import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Sun, Heart, Mic, Scale, CheckCircle2, ArrowRight } from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen size={28} />,
  TrendingUp: <TrendingUp size={28} />,
  Sun: <Sun size={28} />,
  Heart: <Heart size={28} />,
  Mic: <Mic size={28} />,
  Scale: <Scale size={28} />,
};

const COLOR_OPTIONS = [
  "from-blue-500 to-indigo-600",
  "from-clarisma-gold to-clarisma-orange",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-orange-500 to-red-600",
];

const DEFAULT_PROGRAMS = [
  {
    title: "Academic Excellence",
    icon: "BookOpen",
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
    icon: "TrendingUp",
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
    icon: "Sun",
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
    icon: "Heart",
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
    icon: "Mic",
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
    icon: "Scale",
    color: "from-orange-500 to-red-600",
    items: [
      "Diversity & Inclusion Training",
      "Legal Literacy Seminars",
      "Workplace Equity Workshops",
      "Rights & Responsibilities Education"
    ]
  }
];

const SpecializedPrograms: React.FC = () => {
  const [programs, setPrograms] = useState(DEFAULT_PROGRAMS);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/landing');
        if (res.ok) {
          const data = await res.json();
          if (data.programs && Array.isArray(data.programs) && data.programs.length > 0) {
            setPrograms(data.programs);
          }
        }
      } catch (err) {
        console.error('Failed to fetch programs', err);
      }
    };
    fetchContent();
  }, []);

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
                  {ICON_MAP[program.icon as string] ?? <BookOpen size={28} />}
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
