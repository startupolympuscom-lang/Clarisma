
import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, X, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Hero: React.FC = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState("https://drive.google.com/file/d/1m8nUWm5US-8l63U0lolu0JZBK7OVmX0k/view?usp=sharing");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.hero_video_url) {
            setVideoUrl(data.hero_video_url);
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings', err);
      }
    };
    fetchSettings();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-clarisma-red">
      {/* Subtle Atmospheric Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-clarisma-gold/10 to-transparent opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl w-full flex flex-col items-center text-center"
      >
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-3 mb-12"
        >
          <div className="h-[1px] w-12 bg-clarisma-gold/30" />
          <span className="text-clarisma-gold text-[10px] font-black uppercase tracking-[0.6em]">
            Est. 2024
          </span>
          <div className="h-[1px] w-12 bg-clarisma-gold/30" />
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white leading-[0.9] mb-10"
        >
          OWN YOUR <br />
          <span className="italic font-light text-clarisma-gold/90">NARRATIVE.</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-slate-400 max-w-xl mx-auto mb-16 leading-relaxed font-light tracking-wide"
        >
          Empowering high-impact leaders to command their space with unshakeable clarity and authentic authority.
        </motion.p>

        <motion.div variants={itemVariants}>
          <button
            onClick={() => setIsVideoOpen(true)}
            className="group relative inline-flex items-center gap-6 px-12 py-6 bg-transparent border border-white/10 rounded-full text-white font-bold text-lg hover:border-clarisma-gold/50 hover:bg-white/5 transition-all duration-700 overflow-hidden"
          >
            <span className="relative z-10 tracking-widest uppercase text-sm">Watch Introductory Video</span>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-clarisma-gold group-hover:text-clarisma-red transition-all duration-500">
              <Play size={18} className="ml-1" />
            </div>
          </button>
        </motion.div>
      </motion.div>

      {/* Minimal Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-clarisma-gold/40 to-transparent" />
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
            >
              {videoUrl.includes('drive.google.com') ? (
                <iframe
                  src={videoUrl.replace(/\/view.*/, '/preview')}
                  className="w-full h-full border-0"
                  allow="autoplay"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
