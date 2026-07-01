import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServicesBentoProps {
  onNavigate?: (destination: string) => void;
}

const ServicesBento: React.FC<ServicesBentoProps> = ({ onNavigate }) => {
  const [titleLine1, setTitleLine1] = React.useState('LEVEL UP');
  const [titleLine2, setTitleLine2] = React.useState('YOUR');
  const [titleHighlight, setTitleHighlight] = React.useState('IMPACT.');
  const [desc, setDesc] = React.useState('Modern tools for the modern professional. We don\'t just coach; we catalyze your career trajectory with precision.');
  const [services, setServices] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.services_title_1) setTitleLine1(data.services_title_1);
          if (data.services_title_2) setTitleLine2(data.services_title_2);
          if (data.services_title_highlight) setTitleHighlight(data.services_title_highlight);
          if (data.services_desc) setDesc(data.services_desc);
        }
      } catch (err) {
        console.error('Failed to load services settings', err);
      }
    };

    const fetchServices = async () => {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch (err) {
        console.error('Failed to load services list', err);
      }
    };

    fetchSettings();
    fetchServices();
  }, []);

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

  const renderIcon = (name: string, size = 20) => {
    const IconComponent = (LucideIcons as any)[name];
    if (IconComponent) {
      return <IconComponent size={size} />;
    }
    return <LucideIcons.HelpCircle size={size} />;
  };

  const getColSpan = (index: number) => {
    const pattern = [7, 5, 5, 7];
    return pattern[index % pattern.length];
  };

  const getThemeStyles = (theme?: string) => {
    const t = theme?.toLowerCase();
    if (t === 'orange') {
      return {
        glow: 'bg-clarisma-orange/10 group-hover:bg-clarisma-orange/20',
        iconBg: 'from-clarisma-orange to-red-600 text-white',
        badge: 'bg-clarisma-orange/10 border-clarisma-orange/20 text-clarisma-orange',
        linkText: 'text-clarisma-orange',
        linkCircle: 'bg-clarisma-orange/10 group-hover/link:bg-clarisma-orange group-hover/link:text-white',
        itemIcon: 'text-clarisma-orange',
        itemBgHover: 'group-hover/item:bg-clarisma-orange'
      };
    }
    // Default to gold
    return {
      glow: 'bg-clarisma-gold/10 group-hover:bg-clarisma-gold/20',
      iconBg: 'from-clarisma-gold to-yellow-600 text-clarisma-red',
      badge: 'bg-clarisma-gold/10 border-clarisma-gold/20 text-clarisma-gold',
      linkText: 'text-clarisma-gold',
      linkCircle: 'bg-clarisma-gold/10 group-hover/link:bg-clarisma-gold group-hover/link:text-clarisma-red',
      itemIcon: 'text-clarisma-gold',
      itemBgHover: 'group-hover/item:bg-clarisma-gold'
    };
  };

  const handleLinkClick = (e: React.MouseEvent, url: string) => {
    if (url === 'retreats') {
      e.preventDefault();
      if (onNavigate) onNavigate('retreats');
    } else if (!url.startsWith('http') && !url.startsWith('#')) {
      e.preventDefault();
      if (onNavigate) onNavigate(url);
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
            {titleLine1} <br />
            {titleLine2} <span className="text-transparent bg-clip-text bg-gradient-to-r from-clarisma-gold to-clarisma-orange">{titleHighlight}</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-lg leading-relaxed border-l-2 border-clarisma-gold/30 pl-6">
            {desc}
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-col items-end">
          <button 
            onClick={() => onNavigate && onNavigate('retreats')}
            className="group flex items-center gap-3 text-xs font-black text-white uppercase tracking-[0.3em] hover:text-clarisma-gold transition-all duration-300"
          >
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
        {services.map((service, index) => {
          const colSpan = getColSpan(index);
          const styles = getThemeStyles(service.color_theme);
          const parsedItems = typeof service.items === 'string' ? JSON.parse(service.items || '[]') : (service.items || []);
          const isSpan7 = colSpan === 7;

          return (
            <motion.div 
              key={service.id}
              variants={itemVariants}
              className={`${
                isSpan7 ? 'lg:col-span-7' : 'lg:col-span-5'
              } glass-card glass-card-hover rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden group flex flex-col h-full border border-white/5`}
            >
              {/* Background Ambient Glow */}
              <div className={`absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 transition-all duration-700 ${styles.glow}`} />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      {service.badge && (
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-3 ${styles.badge}`}>
                          {service.badge}
                        </div>
                      )}
                      <h3 className="text-3xl md:text-5xl font-black mb-2 text-white leading-none tracking-tighter uppercase whitespace-pre-line">
                        {service.title}
                      </h3>
                    </div>
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-2xl transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-700 ${styles.iconBg}`}>
                      {renderIcon(service.icon_name || 'User', 32)}
                    </div>
                  </div>

                  <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-xl">
                    {service.description}
                  </p>

                  {/* Sub items/features */}
                  {isSpan7 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {parsedItems.map((item: any, i: number) => (
                        <FeatureItem 
                          key={i}
                          icon={renderIcon(item.icon || 'Compass', 20)}
                          title={item.title}
                          desc={item.desc}
                          iconColorClass={styles.itemIcon}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {parsedItems.map((item: any, i: number) => (
                        <CompactFeatureItem 
                          key={i}
                          icon={renderIcon(item.icon || 'Mic', 16)}
                          title={item.title}
                          desc={item.desc}
                          iconBgClass={styles.itemIcon}
                          iconBgHover={styles.itemBgHover}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                  <a 
                    href={service.link_url} 
                    target={service.link_url.startsWith('http') ? "_blank" : undefined}
                    rel={service.link_url.startsWith('http') ? "noopener noreferrer" : undefined}
                    onClick={(e) => handleLinkClick(e, service.link_url)}
                    className={`group/link flex items-center gap-3 text-base font-black uppercase tracking-widest hover:gap-5 transition-all duration-300 ${styles.linkText}`}
                  >
                    {service.link_text} 
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${styles.linkCircle}`}>
                      <ArrowRight size={18} />
                    </div>
                  </a>
                  <span className="text-white/10 font-black text-5xl select-none group-hover:text-white/20 transition-colors duration-700">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode, title: string, desc: string, iconColorClass?: string }> = ({ icon, title, desc, iconColorClass = 'text-clarisma-gold' }) => (
  <div className="flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300 group/item w-full">
    <div className={`shrink-0 mt-1 ${iconColorClass} group-hover/item:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <div>
      <h4 className="font-black text-white text-base leading-tight mb-1 uppercase tracking-tight">{title}</h4>
      <p className="text-xs text-slate-400 leading-snug">{desc}</p>
    </div>
  </div>
);

const CompactFeatureItem: React.FC<{ icon: React.ReactNode, title: string, desc: string, iconBgClass?: string, iconBgHover?: string }> = ({ icon, title, desc, iconBgClass = 'text-clarisma-orange', iconBgHover = 'group-hover/item:bg-clarisma-orange' }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all duration-300 group/item w-full">
    <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${iconBgClass} transition-all duration-300 ${iconBgHover} group-hover/item:text-white`}>
      {icon}
    </div>
    <div>
      <h4 className="font-bold text-white text-sm uppercase tracking-widest">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

export default ServicesBento;