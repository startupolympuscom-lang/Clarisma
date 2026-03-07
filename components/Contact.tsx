
import React, { useState } from 'react';
import { Mail, Calendar, MapPin, Send, CheckCircle, Loader2 } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const bookingUrl = "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulate a brief loading state for UX
    setTimeout(() => {
      const subject = `Clarisma Inquiry: ${formData.firstName} ${formData.lastName}`;
      const body = `Name: ${formData.firstName} ${formData.lastName}%0D%0AEmail: ${formData.email}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
      
      // Open email client
      window.location.href = `mailto:clarisma.info@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`; // body is manually encoded above for newlines
      
      setStatus('success');
      
      // Reset form after a delay
      setTimeout(() => {
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
        setStatus('idle');
      }, 3000);
    }, 800);
  };

  return (
    <section id="contact" className="px-4 md:px-8 max-w-5xl mx-auto w-full mb-20">
      <div className="glass-card rounded-[3rem] p-8 md:p-16 overflow-hidden relative">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-clarisma-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <div>
            <h2 className="text-4xl font-extrabold mb-6">Let's Talk.</h2>
            <p className="text-slate-400 mb-8 text-lg">
              Ready to reclaim your professional narrative? Schedule a discovery call or send us a direct message.
            </p>
            
            <div className="space-y-6">
              <a 
                href={bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-clarisma-gold/20 transition-colors">
                  <Calendar className="text-clarisma-gold" size={20} />
                </div>
                <span className="font-medium">Book a Discovery Call</span>
              </a>
              
              <a 
                href="mailto:clarisma.info@gmail.com"
                className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-clarisma-gold/20 transition-colors">
                  <Mail className="text-clarisma-gold" size={20} />
                </div>
                <span className="font-medium">clarisma.info@gmail.com</span>
              </a>

              <div className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <MapPin className="text-clarisma-gold" size={20} />
                </div>
                <span className="font-medium max-w-[250px]">RUE 14 AMAL 2 IMM N°2 ETAGE 3 N°8, SIDI BERNOUSSI – Casablanca, Morocco</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {status === 'success' ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in bg-slate-900/50 rounded-3xl backdrop-blur-sm border border-clarisma-gold/20 p-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="text-green-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Prepared!</h3>
                <p className="text-slate-300">Opening your email client to send the message...</p>
              </div>
            ) : null}

            <form onSubmit={handleSubmit} className={`space-y-4 transition-opacity duration-300 ${status === 'success' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs font-bold text-slate-500 uppercase ml-2">First Name</label>
                  <input 
                    type="text" 
                    id="firstName"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:border-clarisma-gold focus:ring-1 focus:ring-clarisma-gold transition-all" 
                    placeholder="Jane" 
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-xs font-bold text-slate-500 uppercase ml-2">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:border-clarisma-gold focus:ring-1 focus:ring-clarisma-gold transition-all" 
                    placeholder="Doe" 
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-slate-500 uppercase ml-2">Email</label>
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:border-clarisma-gold focus:ring-1 focus:ring-clarisma-gold transition-all" 
                  placeholder="jane@company.com" 
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-bold text-slate-500 uppercase ml-2">Message</label>
                <textarea 
                  id="message"
                  name="message"
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl p-4 text-white focus:outline-none focus:border-clarisma-gold focus:ring-1 focus:ring-clarisma-gold transition-all" 
                  placeholder="Tell us about your goals..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={status !== 'idle'}
                className="w-full bg-gradient-to-r from-clarisma-gold to-clarisma-orange text-clarisma-red font-bold py-4 rounded-2xl hover:scale-[1.02] transition-transform shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {status === 'sending' ? (
                  <>Sending... <Loader2 className="animate-spin" size={18} /></>
                ) : (
                  <>Send Message <Send size={18} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
