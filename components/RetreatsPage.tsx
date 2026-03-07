import React, { useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, ArrowRight, Star } from 'lucide-react';

interface RetreatsPageProps {
  onBack: () => void;
}

const RetreatsPage: React.FC<RetreatsPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const retreats = [
    {
      id: 1,
      city: "Marrakech",
      title: "The Red City Leadership Immersion",
      date: "October 12-15, 2026",
      location: "La Mamounia & Private Villas",
      price: "From $2,400",
      image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=1000&auto=format&fit=crop",
      tags: ["Executive Presence", "Strategy", "Luxury"],
      description: "A 4-day intensive for senior leaders designed to refine your executive narrative amidst the timeless elegance of Marrakech. Includes private souk tours and rooftop strategy sessions."
    },
    {
      id: 2,
      city: "Taghazout Bay",
      title: "Coastal Clarity & Flow",
      date: "November 24-27, 2026",
      location: "Fairmont Taghazout Bay",
      price: "From $1,800",
      image: "https://images.unsplash.com/photo-1540263624424-640a324d55b5?q=80&w=1000&auto=format&fit=crop",
      tags: ["Burnout Recovery", "Wellness", "Creativity"],
      description: "Reconnect with your purpose where the desert meets the ocean. This retreat combines surf, sand, and soul-searching workshops to unlock creative blocks and combat professional burnout."
    },
    {
      id: 3,
      city: "Atlas Mountains",
      title: "The Summit: Visionary Thinking",
      date: "January 15-18, 2026",
      location: "Kasbah Tamadot",
      price: "From $2,800",
      image: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?q=80&w=1000&auto=format&fit=crop",
      tags: ["High Performance", "Networking", "Adventure"],
      description: "Elevate your perspective—literally. A high-altitude retreat for entrepreneurs and academics focusing on long-term visioning and legacy building in the serene Atlas Mountains."
    }
  ];

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Back Button */}
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-slate-400 hover:text-clarisma-gold mb-8 transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        Back to Home
      </button>

      {/* Header */}
      <div className="text-center mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clarisma-gold/10 border border-clarisma-gold/20 text-clarisma-gold text-xs font-bold uppercase tracking-widest mb-6">
          Collective Growth Program
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
          Escape. Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">Evolve.</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Immersive long-weekend retreats in Morocco's most inspiring locations. 
          Designed for professionals who need to step back to leap forward.
        </p>
      </div>

      {/* Retreats Grid */}
      <div className="grid grid-cols-1 gap-12">
        {retreats.map((retreat, index) => (
          <div 
            key={retreat.id}
            className="glass-card rounded-[2.5rem] overflow-hidden group transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 relative"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            {/* Coming Soon Sticker Overlay */}
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-clarisma-gold/90 text-clarisma-red font-extrabold text-2xl md:text-4xl px-8 py-4 rounded-2xl -rotate-6 shadow-2xl border-4 border-white/30 uppercase tracking-widest backdrop-blur-md transform hover:scale-110 transition-transform">
                Coming Soon
              </div>
            </div>

            {/* Blurred Content Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 filter blur-[3px] opacity-60 grayscale-[20%] pointer-events-none select-none">
              {/* Image Side */}
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                  {retreat.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <img 
                  src={retreat.image} 
                  alt={retreat.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-900/50" />
              </div>

              {/* Content Side */}
              <div className="p-8 md:p-12 flex flex-col justify-center relative">
                 {/* Decorative background blur */}
                 <div className="absolute top-1/2 right-0 w-64 h-64 bg-clarisma-gold/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2" />

                <div className="flex items-center gap-2 text-clarisma-gold mb-2 font-bold uppercase tracking-widest text-sm">
                  <MapPin size={16} /> {retreat.city}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {retreat.title}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-clarisma-orange">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Dates</p>
                      <p className="font-medium">{retreat.date}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-clarisma-orange">
                      <Star size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 uppercase font-bold">Accommodation</p>
                      <p className="font-medium">{retreat.location}</p>
                    </div>
                  </div>
                </div>

                <p className="text-slate-400 mb-8 leading-relaxed">
                  {retreat.description}
                </p>

                <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-auto">
                  <div>
                    <span className="text-sm text-slate-500 block">All-inclusive package</span>
                    <span className="text-2xl font-bold text-white">{retreat.price}</span>
                  </div>
                  <a 
                    href="#contact"
                    className="bg-white text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-clarisma-gold transition-colors flex items-center gap-2 group/btn shadow-lg"
                    tabIndex={-1}
                  >
                    Reserve Spot
                    <ArrowRight size={18} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 text-center glass-card p-12 rounded-[3rem] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-clarisma-red to-black opacity-50" />
        <div className="relative z-10">
          <Users size={48} className="text-clarisma-gold mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Custom Corporate Retreats?</h2>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            We design bespoke retreat experiences for executive teams, law firms, and academic departments. 
            Let us handle the logistics while you focus on the breakthroughs.
          </p>
          <button className="text-white border-b border-clarisma-gold pb-1 font-bold hover:text-clarisma-gold transition-colors">
            Inquire About Private Groups
          </button>
        </div>
      </div>
    </div>
  );
};

export default RetreatsPage;