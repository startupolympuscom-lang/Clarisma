
import React, { useEffect } from 'react';
import { ArrowLeft, BookOpen, Gavel, Scale } from 'lucide-react';

interface FounderPageProps {
  onBack: () => void;
}

const FounderPage: React.FC<FounderPageProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const bookingUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW";

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

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
            {/* Image */}
            <div className="relative animate-in fade-in slide-in-from-left-8 duration-700">
                 <div className="absolute inset-0 bg-gradient-to-tr from-clarisma-gold to-clarisma-orange rounded-[3rem] rotate-3 opacity-20 blur-sm transform scale-105" />
                 <img 
                   src="https://aui.ma/hs-fs/hubfs/Faculty/Harbon%20Claris-1.jpg?width=385&height=385&name=Harbon%20Claris-1.jpg" 
                   alt="Dr. Claris Harbon" 
                   className="relative w-full h-[600px] object-cover rounded-[3rem] shadow-2xl border border-white/10"
                 />
                 {/* Name Card */}
                 <div className="absolute bottom-8 left-8 right-8 glass-card p-6 rounded-2xl text-center backdrop-blur-xl border border-white/20">
                    <h1 className="text-3xl font-bold text-white">Dr. Claris Harbon</h1>
                    <p className="text-clarisma-gold font-medium uppercase tracking-widest text-sm mt-1">Founder & Principal Consultant</p>
                 </div>
            </div>

            {/* Bio Text */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-100">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                    Legal Mind. <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">
                        Storyteller's Heart.
                    </span>
                </h2>

                {/* Highlighted Credentials */}
                <div className="mb-8 p-5 border-l-4 border-clarisma-gold bg-white/5 rounded-r-2xl backdrop-blur-sm shadow-lg">
                  <p className="text-lg md:text-xl text-white leading-relaxed font-serif">
                    <span className="text-clarisma-gold font-bold block text-xl mb-0">Associate Professor in International Law and in Gender Studies</span>
                  </p>
                </div>

                <div className="space-y-6 text-slate-300 text-lg leading-relaxed mb-10">
                    <p>
                        Yale and McGill Universities graduate with expertise in legal scholarship and social justice.
                    </p>
                    <p>
                        Dr. Claris holds a doctorate from McGill and two LL.M. degrees, including one from Yale Law School.
                    </p>
                    <p>
                        Her 20 years in feminist, anti-racist, and social justice advocacy informs her scholarship on marginalized minorities of the Global South.
                    </p>
                </div>

                {/* Universities */}
                <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-4">
                        {/* Yale Badge */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-clarisma-gold/30 transition-colors group flex-1 min-w-[240px]">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg border-2 border-white/10 group-hover:scale-105 transition-transform">
                                <img 
                                    src="https://law.yale.edu/themes/custom/yls_main/logo2x.png" 
                                    alt="Yale Law School" 
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Graduate of</p>
                                <p className="font-bold text-white text-lg">Yale Law School</p>
                            </div>
                        </div>

                        {/* McGill Badge */}
                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4 hover:border-clarisma-gold/30 transition-colors group flex-1 min-w-[240px]">
                             <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg border-2 border-white/10 group-hover:scale-105 transition-transform overflow-hidden">
                                <img 
                                    src="https://i.ytimg.com/vi/td3M90wnV-I/hqdefault.jpg" 
                                    alt="McGill University" 
                                    className="w-full h-full object-cover scale-150"
                                />
                             </div>
                            <div>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">Graduate of</p>
                                <p className="font-bold text-white text-lg">McGill University Faculty of Law</p>
                            </div>
                        </div>
                    </div>

                    {/* Al Akhawayn Badge - Full Width with past title */}
                    <div className="bg-slate-800/50 border border-clarisma-gold/50 rounded-xl p-4 flex items-center gap-4 hover:border-clarisma-gold transition-colors group shadow-[0_0_20px_rgba(251,191,36,0.1)]">
                         <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center p-1 shadow-lg border-2 border-clarisma-gold/20 group-hover:scale-105 transition-transform shrink-0">
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Al_Akhawayn_University_Logo.png/1273px-Al_Akhawayn_University_Logo.png" 
                                alt="Al Akhawayn University" 
                                className="w-full h-full object-contain"
                            />
                         </div>
                        <div className="flex-1">
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                                <div>
                                    <p className="text-xs text-clarisma-gold uppercase tracking-wider font-bold">Current Associate Professor</p>
                                    <p className="font-bold text-white text-lg">Al Akhawayn University</p>
                                </div>
                                <div className="mt-2 md:mt-0 md:text-right">
                                    <p className="text-xs text-slate-400 font-medium">Former Director, The Hillary Clinton Center for Women’s Empowerment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Value Prop Grid */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
            <div className="text-center mb-16 max-w-2xl mx-auto">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">The <span className="text-clarisma-gold">Scholar-Practitioner</span> Advantage</h3>
                <p className="text-slate-400">
                    Dr. Harbon translates elite academic rigor into actionable strategies for the modern professional world.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ValueCard 
                    icon={<Gavel className="text-clarisma-gold" size={24} />}
                    title="For Career Coaching"
                    subtitle="Forensic Career Strategy"
                    desc="Dr. Harbon applies legal analytical frameworks to dissect your career challenges. She helps you build an 'argument' for your own value that is irrefutable in salary negotiations, interviews, and promotions."
                />
                 <ValueCard 
                    icon={<BookOpen className="text-clarisma-gold" size={24} />}
                    title="For Academic Clients"
                    subtitle="The Insider's Playbook"
                    desc="Having navigated the rigors of Yale and McGill, she understands the unique pressures of the ivory tower. Her coaching demystifies the path to tenure, publication, and dissertation defense with empathetic authority."
                />
                 <ValueCard 
                    icon={<Scale className="text-clarisma-gold" size={24} />}
                    title="For Organizations"
                    subtitle="Ethical Leadership"
                    desc="She translates complex theories of power and narrative into actionable leadership strategies, teaching teams how to wield influence with ethical authority, resolve conflict, and foster authentic inclusivity."
                />
            </div>
        </div>

        {/* CTA */}
        <div className="glass-card rounded-3xl p-12 text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-clarisma-gold/10 rounded-full blur-[80px]" />
             <div className="relative z-10">
                 <h2 className="text-3xl font-bold mb-6">Ready to work with Dr. Harbon?</h2>
                 <a 
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-clarisma-red px-8 py-4 rounded-full font-bold hover:bg-clarisma-gold transition-colors shadow-lg hover:scale-105 transform duration-300"
                  >
                    Book a Discovery Call
                  </a>
             </div>
        </div>
     </div>
  );
}

const ValueCard = ({icon, title, subtitle, desc}: any) => (
    <div className="glass-card p-8 rounded-[2rem] border border-white/5 hover:border-clarisma-gold/30 hover:bg-white/5 transition-all duration-300 group">
        <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-inner">
            {icon}
        </div>
        <div className="mb-4">
            <h4 className="text-xs font-bold text-clarisma-gold uppercase tracking-widest mb-1">{title}</h4>
            <h5 className="text-xl font-bold text-white">{subtitle}</h5>
        </div>
        <p className="text-slate-400 leading-relaxed text-sm">{desc}</p>
    </div>
)

export default FounderPage;
