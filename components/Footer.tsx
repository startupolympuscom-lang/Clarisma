import React from 'react';
import { Instagram, Linkedin, Facebook } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-md pt-20 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div>
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_2025-06-11_at_02.53.22-removebg-preview%281%29-rzKZHVERM2kVh5mGmBYsxLGqGzqszC.png" 
            alt="Clarisma" 
            className="h-24 w-auto mb-6 object-contain contrast-125 drop-shadow-sm"
          />
          <p className="text-slate-400 max-w-xs">
            Redefining professional development for the next generation of leaders.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div>
            <h4 className="font-bold text-white mb-4">Sitemap</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-clarisma-gold transition-colors">Home</a></li>
              <li><a href="#services" className="hover:text-clarisma-gold transition-colors">Services</a></li>
              <li><a href="#about" className="hover:text-clarisma-gold transition-colors">About</a></li>
              <li><a href="#contact" className="hover:text-clarisma-gold transition-colors">Contact</a></li>
              <li><button onClick={() => window.dispatchEvent(new CustomEvent('navigate', { detail: 'admin' }))} className="hover:text-clarisma-gold transition-colors">Admin Login</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-400">
              <li><a href="#" className="hover:text-clarisma-gold transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-clarisma-gold transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <a 
            href="https://www.linkedin.com/company/clarisma/about/?viewAsMember=true" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-clarisma-gold hover:text-clarisma-red transition-all" 
            aria-label="LinkedIn"
          >
            <Linkedin size={20} />
          </a>
          <a 
            href="https://www.facebook.com/share/16kRu4zriP/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-clarisma-gold hover:text-clarisma-red transition-all"
            aria-label="Facebook"
          >
            <Facebook size={20} />
          </a>
          <a 
            href="https://www.instagram.com/clarisma.212?igsh=M2I2aDhvNWN2c3p3" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-clarisma-gold hover:text-clarisma-red transition-all"
            aria-label="Instagram"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-slate-500 text-sm">
        &copy; {new Date().getFullYear()} Clarisma. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;