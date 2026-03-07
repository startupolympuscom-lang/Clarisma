
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onNavigate: (destination: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Services', href: '#services', isPage: false },
    { name: 'About', href: '#', isPage: true, destination: 'founder' },
    { name: 'Retreats', href: '#', isPage: true, destination: 'retreats' },
    { name: 'Stories', href: '#testimonials', isPage: false },
    { name: 'Contact', href: '#contact', isPage: false },
  ];

  const handleLinkClick = (e: React.MouseEvent, link: any) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (link.isPage) {
      onNavigate(link.destination);
    } else {
      onNavigate(link.href);
    }
  };

  const bookingUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW";

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-5xl transition-all duration-300 ${
      scrolled || mobileMenuOpen ? 'top-4' : 'top-6'
    }`}>
      <div className={`bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 md:py-4 flex items-center justify-between transition-all duration-300 shadow-2xl ${
        mobileMenuOpen ? 'rounded-3xl' : ''
      }`}>
        {/* Logo */}
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
          className="flex items-center gap-2 group relative z-50 shrink-0"
        >
           {logoError ? (
             <span className="text-3xl font-extrabold text-clarisma-red tracking-tight font-serif">Clarisma</span>
           ) : (
             <img 
               src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-06-11_at_02.53.22-removebg-preview%281%29-rzKZHVERM2kVh5mGmBYsxLGqGzqszC.png" 
               alt="Clarisma" 
               onError={() => setLogoError(true)}
               className="h-20 md:h-32 w-auto object-contain transition-transform duration-300 group-hover:scale-105 block drop-shadow-md contrast-125"
             />
           )}
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link)}
              className="text-sm font-bold text-slate-200 hover:text-clarisma-gold transition-colors uppercase tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a 
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-clarisma-red text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-clarisma-orange transition-all duration-300 hover:scale-105 shadow-lg whitespace-nowrap border border-white/10"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mt-2 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:hidden animate-in fade-in slide-in-from-top-4 shadow-2xl">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className="text-lg font-bold text-slate-200 hover:text-clarisma-gold"
              >
                {link.name}
              </a>
            ))}
            <a 
              href={bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-clarisma-red text-white text-center py-3 rounded-xl font-bold mt-2 shadow-md border border-white/10"
            >
              Book Consultation
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
