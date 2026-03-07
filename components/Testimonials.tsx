import React from 'react';
import { Quote, Star, ArrowRight } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      quote: "Working with Dr. Harbon was one of the most meaningful experiences of my studies. Through our projects, and my volunteering to promote equality and discuss women’s rights in Morocco, I learned the power of creating spaces where women can grow, learn, and be heard. Her fiery soul, constant energy, and ability to find meaning in everything around her have shaped the way I approach challenges and purpose.",
      author: "Kenza Sifi",
      role: "Student of International Relations & Affair",
      company: "University Al Akhawayn"
    },
    {
      quote: "At Startup Olympus, we look for founders who are solving real problems with passion. Dr. Claris Harbon is the embodiment of that spirit. Through Clarisma, she is redefining what it means to be empowered in both life and business. Her energy is infectious, and her dedication to helping others unlock their potential is genuine. Dr. Harbon is a force of nature.",
      author: "Abderrahim Hamidine",
      role: "Director",
      company: "Startup Olympus"
    }
  ];

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden bg-clarisma-red">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-clarisma-gold/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-clarisma-orange/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-xs font-bold uppercase tracking-widest mb-6">
              Voices of Transformation
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-6">
              HEARD. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">VALUED.</span> <br />
              EMPOWERED.
            </h2>
          </div>
          <div className="hidden lg:block text-right">
            <div className="flex items-center gap-1 justify-end mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-clarisma-gold text-clarisma-gold" />
              ))}
            </div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">Trusted by Global Leaders</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="group relative flex flex-col gap-8 glass-card p-8 md:p-10 rounded-[3rem] border border-white/5 hover:border-clarisma-gold/20 transition-all duration-500"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-10 right-10 text-white/5 w-32 h-32 -z-0 group-hover:text-clarisma-gold/10 transition-colors duration-500" />
              
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className="fill-clarisma-gold text-clarisma-gold" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl font-serif italic text-slate-100 leading-snug mb-8 group-hover:text-white transition-colors">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <h4 className="text-lg font-black text-white group-hover:text-clarisma-gold transition-colors">{t.author}</h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{t.role}</span>
                    <span className="w-1 h-1 rounded-full bg-clarisma-gold/40" />
                    <span className="text-xs font-bold uppercase tracking-widest text-clarisma-gold">{t.company}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <a 
            href="#contact" 
            className="inline-flex items-center gap-3 text-sm font-black uppercase tracking-[0.2em] text-white hover:text-clarisma-gold transition-all group"
          >
            Share Your Story <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;