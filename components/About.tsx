import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onNavigate?: (destination: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  const [badge, setBadge] = useState('About Clarisma');
  const [heading1, setHeading1] = useState('Clarify your charisma.');
  const [heading2, setHeading2] = useState('Magnify your impact.');
  const [bodyP1, setBodyP1] = useState('Clarisma is a personal and professional empowerment platform created by Professor Dr. Claris Harbon. We help professionals in different fields, disciplines and schools, and at any stage of their career, such as, but not exclusively limited to, law, to academia, and human rights, reclaim their confidence and chart intentional career paths.');
  const [bodyP2, setBodyP2] = useState('Our mission is to fuse legal wisdom, storytelling, and leadership into a transformational journey that honors your expertise while empowering your next chapter.');
  const [founderName, setFounderName] = useState('Dr. Claris Harbon');
  const [founderTitle, setFounderTitle] = useState('Associate Professor in International Law and in Gender Studies.');

  const [founderImage, setFounderImage] = useState('https://aui.ma/hs-fs/hubfs/Faculty/Harbon%20Claris-1.jpg?width=385&height=385&name=Harbon%20Claris-1.jpg');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.about_badge) setBadge(data.about_badge);
          if (data.about_heading1) setHeading1(data.about_heading1);
          if (data.about_heading2) setHeading2(data.about_heading2);
          if (data.about_body_p1) setBodyP1(data.about_body_p1);
          if (data.about_body_p2) setBodyP2(data.about_body_p2);
          if (data.about_founder_name) setFounderName(data.about_founder_name);
          if (data.about_founder_title) setFounderTitle(data.about_founder_title);
          if (data.about_founder_image_url) setFounderImage(data.about_founder_image_url);
        }
      } catch (err) {
        console.error('Failed to load about section settings', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section id="about" className="px-4 md:px-8 max-w-7xl mx-auto w-full py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Visual Side */}
        <div className="relative order-2 lg:order-1">
          <div className="absolute inset-0 bg-gradient-to-tr from-clarisma-gold to-clarisma-orange rounded-[40px] rotate-3 opacity-20 blur-sm transform scale-105" />
          <div className="relative h-[600px] w-full bg-slate-800 rounded-[40px] overflow-hidden border border-slate-700 shadow-2xl group">
             {/* Founder Image - Using a reliable placeholder for the demo */}
             <img 
               src={founderImage} 
               alt={founderName} 
               className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
             />
             
             {/* Floating Stats Card */}
             <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-3xl border-t border-white/20 backdrop-blur-xl">
               <div className="flex justify-between items-center text-center">
                 <div>
                   <div className="text-3xl font-extrabold text-white">20+</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Years Advocacy</div>
                 </div>
                 <div className="w-px h-10 bg-slate-600" />
                 <div>
                   <div className="text-3xl font-extrabold text-clarisma-gold">Global</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Reach</div>
                 </div>
                 <div className="w-px h-10 bg-slate-600" />
                 <div>
                   <div className="text-3xl font-extrabold text-white">Values</div>
                   <div className="text-xs text-slate-400 uppercase tracking-wider mt-1">Driven</div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Content Side */}
        <div className="order-1 lg:order-2">
          <h2 className="text-sm font-bold text-clarisma-gold uppercase tracking-widest mb-4">{badge}</h2>
          <h3 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            {heading1} <br />
            <span className="text-slate-500">{heading2}</span>
          </h3>
          
          <div className="space-y-6 text-lg text-slate-300 leading-relaxed mb-8">
            <p dangerouslySetInnerHTML={{ __html: bodyP1 }} />
            <p dangerouslySetInnerHTML={{ __html: bodyP2 }} />
          </div>

          {/* Founder Bio Card */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-l-clarisma-gold mb-8 relative overflow-hidden group hover:bg-white/5 transition-colors">
            <div className="relative z-10">
                <h4 className="text-white font-bold text-xl mb-2">{founderName}</h4>
                <p className="text-sm text-slate-300 mb-4 leading-relaxed font-medium">
                   {founderTitle}
                </p>
                
                <div className="flex flex-wrap gap-4 items-start">
                   <div className="flex items-center gap-3 bg-black/20 pr-4 py-1 rounded-full border border-white/5 mt-1">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-white/10 overflow-hidden p-1">
                          <img src="https://law.yale.edu/themes/custom/yls_main/logo2x.png" alt="Yale" className="w-full h-full object-contain" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Yale Law School</span>
                   </div>
                   <div className="flex items-center gap-3 bg-black/20 pr-4 py-1 rounded-full border border-white/5 mt-1">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-white/10 overflow-hidden p-0.5">
                          <img src="https://i.ytimg.com/vi/td3M90wnV-I/hqdefault.jpg" alt="McGill" className="w-full h-full object-cover scale-125" />
                      </div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">McGill University Faculty of Law</span>
                   </div>
                   {/* Al Akhawayn Highlight */}
                   <div className="flex items-start gap-3 bg-clarisma-gold/10 pr-4 py-2 rounded-[2rem] border border-clarisma-gold/30">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-clarisma-gold/20 overflow-hidden p-0.5 shrink-0 mt-0.5">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Al_Akhawayn_University_Logo.png/1273px-Al_Akhawayn_University_Logo.png" alt="Al Akhawayn" className="w-full h-full object-contain" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white uppercase tracking-wide">Al Akhawayn Univ.</span>
                        <span className="text-[10px] text-clarisma-gold font-bold uppercase tracking-wider">Current Assoc. Prof.</span>
                        <span className="text-[9px] text-slate-500 font-medium leading-tight mt-1 max-w-[180px]">Former Director, Hillary Clinton Center for Women’s Empowerment</span>
                      </div>
                   </div>
                </div>
            </div>
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-clarisma-gold/5 rounded-full blur-2xl group-hover:bg-clarisma-gold/10 transition-all" />
          </div>

          <button 
            onClick={() => onNavigate && onNavigate('founder')}
            className="mt-6 text-white border-b-2 border-white/20 hover:border-clarisma-gold pb-1 transition-colors font-bold text-lg"
          >
            Meet The Founder
          </button>
        </div>

      </div>
    </section>
  );
};

export default About;