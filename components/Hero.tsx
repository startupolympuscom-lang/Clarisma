
import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const Hero: React.FC = () => {
  const bookingUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW";

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 overflow-hidden bg-clarisma-red">
      {/* Immersive Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-clarisma-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-clarisma-orange/10 rounded-full blur-[150px]" />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl w-full flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-clarisma-gold text-xs font-bold uppercase tracking-[0.3em] mb-8 backdrop-blur-sm"
        >
          <Sparkles size={14} className="animate-pulse" />
          The Future of Leadership
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1] mb-8 select-none"
        >
          OWN YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold via-white to-clarisma-gold bg-[length:200%_auto] animate-shimmer">
            NARRATIVE.
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed font-light tracking-wide"
        >
          Empowering ambitious individuals to lead with <span className="text-white font-medium italic">clarity</span>, <span className="text-white font-medium italic">confidence</span>, and <span className="text-white font-medium italic">authentic authority</span>.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-10 py-5 bg-white text-clarisma-red rounded-full font-black text-xl hover:bg-clarisma-gold hover:text-clarisma-red transition-all duration-500 flex items-center gap-3 shadow-2xl overflow-hidden"
          >
            <span className="relative z-10">Get Started Now</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform duration-500" />
          </a>
          
          <button className="px-10 py-5 rounded-full font-bold text-xl text-white border border-white/20 hover:bg-white/10 hover:border-white/40 transition-all flex items-center gap-3 group backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-500">
               <Play size={16} className="ml-1 fill-white text-white" />
            </div>
            Watch Showreel
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold">Discover More</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-clarisma-gold/50 to-transparent animate-bounce" />
      </motion.div>

      {/* Abstract Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] right-[10%] w-64 h-64 border border-white/5 rounded-[3rem] rotate-12" 
        />
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] left-[5%] w-48 h-48 border border-white/5 rounded-full" 
        />
      </div>
    </section>
  );
};

export default Hero;
