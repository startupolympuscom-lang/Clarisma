import React from 'react';
import { Scale, GraduationCap, HeartHandshake } from 'lucide-react';

const TargetAudience: React.FC = () => {
  const audiences = [
    {
      icon: <Scale size={32} />,
      title: "Law & Legal Advocacy",
      description: "Attorneys, legal advocates, and public interest lawyers seeking to realign their careers with their values and reclaim their professional confidence.",
      delay: "0"
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Higher Education & Research",
      description: "Academics, researchers, and education professionals navigating institutional challenges and seeking alternative career paths or renewed purpose.",
      delay: "100"
    },
    {
      icon: <HeartHandshake size={32} />,
      title: "Public Interest & Social Justice",
      description: "Activists, nonprofit leaders, and social justice advocates looking to prevent burnout and create sustainable, impactful careers.",
      delay: "200"
    }
  ];

  return (
    <section className="px-4 md:px-8 max-w-7xl mx-auto w-full py-20 relative">
       {/* Background Ambient Glow */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-full bg-clarisma-red/10 blur-[120px] rounded-full pointer-events-none -z-10" />

       {/* Header */}
       <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-xs font-bold uppercase tracking-widest mb-4">
            Target Audience
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
             Who It's For
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed">
             Clarisma serves early and mid-career professionals who are ready to reclaim their narrative and step into their full potential.
          </p>
       </div>

       {/* Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((item, index) => (
             <div 
                key={index} 
                className="glass-card glass-card-hover p-8 md:p-10 rounded-[2rem] relative overflow-hidden group flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards"
                style={{ animationDelay: `${item.delay}ms` }}
             >
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-white/10 shadow-lg">
                   <div className="text-clarisma-gold drop-shadow-md">
                     {item.icon}
                   </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-clarisma-gold transition-colors duration-300">
                    {item.title}
                </h3>
                
                <p className="text-slate-400 leading-relaxed text-base">
                  {item.description}
                </p>

                {/* Decorative Corner Gradient */}
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-clarisma-gold/10 rounded-full blur-2xl group-hover:bg-clarisma-gold/20 transition-all duration-500" />
             </div>
          ))}
       </div>
    </section>
  );
};

export default TargetAudience;