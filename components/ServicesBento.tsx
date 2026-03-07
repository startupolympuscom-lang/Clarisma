import React from 'react';
import { User, Users, Compass, GraduationCap, Heart, Eye, Mic, Briefcase, BookOpen, Megaphone, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServicesBentoProps {
  onNavigate?: (destination: string) => void;
}

const ServicesBento: React.FC<ServicesBentoProps> = ({ onNavigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section id="services" className="px-4 md:px-8 max-w-7xl mx-auto w-full py-20">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10"
      >
        <motion.div variants={itemVariants} className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
            <Sparkles size={10} /> Professional Evolution
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.85] text-white mb-6">
            LEVEL UP <br />
            YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">IMPACT.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed border-l-2 border-clarisma-gold/30 pl-6">
            Modern tools for the modern professional. We don't just coach; we catalyze your career trajectory with precision.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col items-end">
          <button className="group flex items-center gap-3 text-xs font-black text-white uppercase tracking-[0.3em] hover:text-clarisma-gold transition-all duration-300">
            View All Programs 
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-clarisma-gold group-hover:bg-clarisma-gold group-hover:text-clarisma-red transition-all duration-500">
              <ArrowRight size={14} />
            </div>
          </button>
        </motion.div>
      </motion.div>

      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        
        {/* Product 1: Reclaim Your Career */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-7 glass-card glass-card-hover rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group flex flex-col h-full border border-white/5"
        >
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-clarisma-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-clarisma-gold/20 transition-all duration-700" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-[10px] font-bold uppercase tracking-widest mb-3">
                  One-on-One Coaching
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-2 text-white leading-none tracking-tighter">
                  RECLAIM <br />YOUR CAREER
                </h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-clarisma-gold to-yellow-600 flex items-center justify-center shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-700">
                <User className="text-clarisma-red" size={32} />
              </div>
            </div>

            <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
              Personalized coaching for professionals at all stages—from students to seasoned experts—navigating career transitions with visibility and recognition.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureItem 
                icon={<Compass size={20} />}
                title="Career Clarity"
                desc="Strengths assessment & roadmapping"
              />
              <FeatureItem 
                icon={<GraduationCap size={20} />}
                title="Academic Edge"
                desc="PhD defense & research strategies"
              />
              <FeatureItem 
                icon={<Heart size={20} />}
                title="Resilience"
                desc="Burnout recovery & self-care"
              />
              <FeatureItem 
                icon={<Eye size={20} />}
                title="Visibility"
                desc="Strategic personal branding"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <a 
                href="https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW" 
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex items-center gap-3 text-clarisma-gold text-base font-black uppercase tracking-widest hover:gap-5 transition-all duration-300"
              >
                Book a Session 
                <div className="w-10 h-10 rounded-full bg-clarisma-gold/10 flex items-center justify-center group-hover/link:bg-clarisma-gold group-hover/link:text-clarisma-red transition-all duration-500">
                  <ArrowRight size={18} />
                </div>
              </a>
              <span className="text-white/10 font-black text-5xl select-none group-hover:text-white/20 transition-colors duration-700">01</span>
            </div>
          </div>
        </motion.div>

        {/* Product 2: Collective Growth */}
        <motion.div 
          variants={itemVariants}
          className="lg:col-span-5 glass-card glass-card-hover rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group flex flex-col h-full border border-white/5"
        >
           {/* Background Ambient Glow */}
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-clarisma-orange/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 group-hover:bg-clarisma-orange/20 transition-all duration-700" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-orange/10 border border-clarisma-orange/20 text-clarisma-orange text-[10px] font-bold uppercase tracking-widest mb-3">
                  Group Programs
                </div>
                <h3 className="text-3xl md:text-4xl font-black mb-2 text-white leading-none tracking-tighter">
                  COLLECTIVE <br />GROWTH
                </h3>
              </div>
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-clarisma-orange to-red-600 flex items-center justify-center shadow-2xl transform group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700">
                <Users className="text-white" size={28} />
              </div>
            </div>

            <p className="text-slate-300 text-base mb-8 leading-relaxed">
              Transformative workshops and retreats designed to build confidence and foster supportive communities.
            </p>

            <div className="space-y-3">
              <CompactFeatureItem 
                icon={<Mic size={16} />}
                title="Confidence"
                desc="Public speaking & EQ"
              />
              <CompactFeatureItem 
                icon={<Briefcase size={16} />}
                title="Leadership"
                desc="Career navigation"
              />
              <CompactFeatureItem 
                icon={<BookOpen size={16} />}
                title="Academic"
                desc="Thesis & research"
              />
              <CompactFeatureItem 
                icon={<Megaphone size={16} />}
                title="Advocacy"
                desc="Women's empowerment"
              />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
              <button 
                onClick={() => onNavigate && onNavigate('retreats')}
                className="group/link flex items-center gap-3 text-clarisma-orange text-base font-black uppercase tracking-widest hover:gap-5 transition-all duration-300"
              >
                View Retreats
                <div className="w-10 h-10 rounded-full bg-clarisma-orange/10 flex items-center justify-center group-hover/link:bg-clarisma-orange group-hover/link:text-white transition-all duration-500">
                  <ArrowRight size={18} />
                </div>
              </button>
              <span className="text-white/10 font-black text-5xl select-none group-hover:text-white/20 transition-colors duration-700">02</span>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group/item">
    <div className="shrink-0 mt-1 text-clarisma-gold group-hover/item:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <div>
      <h4 className="font-black text-white text-base leading-tight mb-1 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 leading-snug">{desc}</p>
    </div>
  </div>
);

const CompactFeatureItem: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all duration-300 group/item">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-clarisma-orange group-hover/item:bg-clarisma-orange group-hover/item:text-white transition-all duration-300">
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white text-sm uppercase tracking-widest">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default ServicesBento;