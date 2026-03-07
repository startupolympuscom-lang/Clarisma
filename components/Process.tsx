import React from 'react';
import { Search, Target, Map, Zap, BarChart3, ArrowRight } from 'lucide-react';

const Process: React.FC = () => {
  const steps = [
    { 
      id: '01', 
      title: 'Assessment', 
      desc: 'We begin with a deep dive into your current landscape, identifying hidden strengths and critical barriers.',
      icon: <Search className="text-clarisma-gold" size={24} />,
      color: 'from-clarisma-gold/20 to-transparent'
    },
    { 
      id: '02', 
      title: 'Goal Setting', 
      desc: 'Defining clear, measurable objectives that align with your long-term vision and immediate needs.',
      icon: <Target className="text-clarisma-orange" size={24} />,
      color: 'from-clarisma-orange/20 to-transparent'
    },
    { 
      id: '03', 
      title: 'Action Planning', 
      desc: 'Crafting a personalized roadmap with actionable steps, timelines, and resource allocation.',
      icon: <Map className="text-clarisma-gold" size={24} />,
      color: 'from-clarisma-gold/20 to-transparent'
    },
    { 
      id: '04', 
      title: 'Implementation', 
      desc: 'Guided execution with continuous support, ensuring you stay on track and overcome obstacles.',
      icon: <Zap className="text-clarisma-orange" size={24} />,
      color: 'from-clarisma-orange/20 to-transparent'
    },
    { 
      id: '05', 
      title: 'Review', 
      desc: 'Evaluating progress against benchmarks and adjusting strategies for sustained performance.',
      icon: <BarChart3 className="text-clarisma-gold" size={24} />,
      color: 'from-clarisma-gold/20 to-transparent'
    },
  ];

  return (
    <section id="process" className="px-4 md:px-8 max-w-7xl mx-auto w-full py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-clarisma-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-clarisma-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start justify-between mb-20 gap-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-xs font-bold uppercase tracking-widest mb-6">
            Our Methodology
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            A Blueprint for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold via-clarisma-orange to-clarisma-gold animate-shimmer bg-[length:200%_auto]">Professional Mastery</span>
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed">
            We don't believe in one-size-fits-all. Our structured approach is designed to adapt to your unique challenges while maintaining a rigorous focus on results.
          </p>
        </div>
        
        <div className="hidden lg:flex flex-col items-end text-right">
          <div className="text-5xl font-black text-white/5 mb-2">05</div>
          <div className="text-sm font-bold uppercase tracking-tighter text-clarisma-gold/40">Proven Stages</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative">
        {/* Connection Line (Desktop) */}
        <div className="hidden lg:block absolute top-[40px] left-[5%] w-[90%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -z-10" />

        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className="group relative flex flex-col h-full animate-in fade-in slide-in-from-bottom-8 fill-mode-forwards"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Step Header */}
            <div className="flex items-center lg:flex-col lg:items-center mb-6 relative z-10">
              <div className="w-12 h-12 rounded-full bg-clarisma-red border border-white/10 flex items-center justify-center group-hover:border-clarisma-gold group-hover:scale-110 transition-all duration-500 shadow-xl relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <span className="text-sm font-black text-white group-hover:text-clarisma-gold transition-colors relative z-10">{step.id}</span>
              </div>
              
              {/* Desktop Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-[calc(50%+24px)] top-1/2 -translate-y-1/2 w-[calc(100%-48px)] h-[1px] bg-gradient-to-r from-white/10 to-transparent" />
              )}
            </div>

            {/* Content Card */}
            <div className="glass-card p-8 rounded-[2rem] flex-1 border border-white/5 group-hover:border-clarisma-gold/20 group-hover:bg-white/5 transition-all duration-500 flex flex-col relative overflow-hidden">
              {/* Icon Background */}
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 transform group-hover:scale-150 group-hover:-rotate-12">
                {React.cloneElement(step.icon as React.ReactElement, { size: 120 })}
              </div>

              <div className="mb-6 p-3 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform duration-500">
                {step.icon}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-clarisma-gold transition-colors">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 flex-1">
                {step.desc}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/20 group-hover:text-clarisma-gold/60 transition-colors">
                <span>Phase {step.id}</span>
                <ArrowRight size={10} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA or Note */}
      <div className="mt-20 p-8 rounded-[2.5rem] bg-gradient-to-r from-clarisma-gold/10 to-transparent border border-clarisma-gold/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-clarisma-gold/20 flex items-center justify-center shrink-0">
            <Zap className="text-clarisma-gold" size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white mb-1">Ready to start the journey?</h4>
            <p className="text-slate-400 text-sm">Most clients see significant breakthroughs within the first 3 phases.</p>
          </div>
        </div>
        <a 
          href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW" 
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-clarisma-gold text-clarisma-red font-black rounded-2xl hover:bg-white hover:scale-105 transition-all shadow-lg shadow-clarisma-gold/20"
        >
          GET STARTED NOW
        </a>
      </div>
    </section>
  );
};

export default Process;
