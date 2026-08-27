import React, { useState } from 'react';
import { Heart, Sparkles, Globe2, Coins } from 'lucide-react';

const bookingUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW";

interface Quadrant {
  key: string;
  label: string;
  icon: React.ReactNode;
  question: string;
  position: string;
}

const quadrants: Quadrant[] = [
  {
    key: 'love',
    label: 'What You Love',
    icon: <Heart size={22} />,
    question: 'What work makes you lose track of time? What would you do even without being paid for it?',
    position: 'top-0 left-0'
  },
  {
    key: 'good',
    label: "What You're Good At",
    icon: <Sparkles size={22} />,
    question: 'What skills come naturally to you, or have you built through years of practice and study?',
    position: 'top-0 right-0'
  },
  {
    key: 'world',
    label: 'What the World Needs',
    icon: <Globe2 size={22} />,
    question: 'What problems around you are waiting for someone with your perspective to solve them?',
    position: 'bottom-0 left-0'
  },
  {
    key: 'paid',
    label: 'What You Can Be Paid For',
    icon: <Coins size={22} />,
    question: 'Where is there real market demand for what you love and what you do well?',
    position: 'bottom-0 right-0'
  }
];

const IkigaiChart: React.FC = () => {
  const [selected, setSelected] = useState<string>('love');
  const active = quadrants.find(q => q.key === selected) ?? quadrants[0];

  return (
    <section id="ikigai" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-xs font-bold uppercase tracking-widest mb-6">
            Career Clarity Tool
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter mb-6">
            Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">Ikigai.</span>
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed">
            The Japanese concept of "a reason for being" — where passion, mission, vocation, and profession meet. Tap each circle to reflect on your own path.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive diagram */}
          <div className="relative w-full max-w-md aspect-square mx-auto">
            {quadrants.map((q) => (
              <button
                key={q.key}
                onClick={() => setSelected(q.key)}
                aria-pressed={selected === q.key}
                className={`absolute ${q.position} w-[62%] h-[62%] rounded-full flex flex-col items-center justify-center text-center p-6 gap-2 transition-all duration-500 border ${
                  selected === q.key
                    ? 'bg-clarisma-gold/20 border-clarisma-gold shadow-[0_0_60px_rgba(251,191,36,0.25)] scale-105 z-10'
                    : 'bg-white/5 border-white/10 hover:border-clarisma-gold/40 hover:bg-white/10'
                }`}
              >
                <span className={selected === q.key ? 'text-clarisma-gold' : 'text-slate-300'}>{q.icon}</span>
                <span className="text-xs md:text-sm font-black uppercase tracking-wider leading-tight">
                  {q.label}
                </span>
              </button>
            ))}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full bg-clarisma-red border border-clarisma-gold/50 flex items-center justify-center text-clarisma-gold font-black text-[10px] uppercase tracking-widest text-center">
                Ikigai
              </div>
            </div>
          </div>

          {/* Reflection panel */}
          <div className="glass-card p-8 rounded-[2rem] border border-white/10 min-h-[280px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4 text-clarisma-gold">
                {active.icon}
                <h3 className="text-xl font-black uppercase tracking-wide">{active.label}</h3>
              </div>
              <p className="text-slate-200 text-lg leading-relaxed">{active.question}</p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-sm text-slate-400 mb-4">
                This exercise is a starting point, not a verdict. For more details, book a session with Dr. Harbon.
              </p>
              <a
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-6 py-3 rounded-full font-bold hover:bg-white transition-all shadow-lg hover:scale-105 transform duration-300"
              >
                Book a Session with Dr. Harbon
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IkigaiChart;
