import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, ArrowRight, Star, FileText, X, CheckCircle } from 'lucide-react';

interface RetreatsPageProps {
  onBack: () => void;
  onAdminAccess: () => void;
}

interface Retreat {
  id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  tags: string[];
  description: string;
  image_url: string;
  price: string;
  signup_url?: string;
  seats_available?: string;
  agenda_url?: string;
  payment_details?: string;
  custom_form_schema?: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string;
  required: boolean;
}

const ReservationForm = ({ retreat, onClose }: { retreat: Retreat, onClose: () => void }) => {
  const customFields: FormField[] = retreat.custom_form_schema ? JSON.parse(retreat.custom_form_schema) : [];
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          retreat_id: retreat.id,
          ...formData,
          answers: JSON.stringify(customAnswers)
        })
      });

      if (res.ok) {
        setIsSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to submit reservation');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-md w-full text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
            <X size={24} />
          </button>
          <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-4">Reservation Submitted!</h3>
          <p className="text-slate-300 mb-8">
            Thank you for reserving your spot for <strong>{retreat.title}</strong>. We will contact you shortly with further details.
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-clarisma-gold text-black font-bold py-3 rounded-xl hover:bg-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-2xl w-full relative my-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
        
        <h3 className="text-3xl font-bold mb-2">Reserve Your Spot</h3>
        <p className="text-slate-400 mb-8">For {retreat.title} ({retreat.date})</p>

        {retreat.payment_details && (
          <div className="bg-clarisma-gold/10 border border-clarisma-gold/30 p-6 rounded-2xl mb-8">
            <h4 className="font-bold text-clarisma-gold mb-2">Payment & Instructions</h4>
            <p className="text-slate-300 whitespace-pre-wrap">{retreat.payment_details}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2">Full Name *</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Email Address *</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold mb-2">Phone Number</label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Message or Special Requirements</label>
            <textarea 
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold h-32"
            />
          </div>

          {customFields.length > 0 && (
            <div className="pt-6 border-t border-white/10 space-y-6">
              <h4 className="font-bold text-lg">Additional Information</h4>
              {customFields.map(field => (
                <div key={field.id}>
                  <label className="block text-sm font-bold mb-2">
                    {field.label} {field.required && '*'}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea 
                      required={field.required}
                      value={customAnswers[field.label] || ''}
                      onChange={e => setCustomAnswers({...customAnswers, [field.label]: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold h-24"
                    />
                  ) : field.type === 'select' ? (
                    <select 
                      required={field.required}
                      value={customAnswers[field.label] || ''}
                      onChange={e => setCustomAnswers({...customAnswers, [field.label]: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                    >
                      <option value="">Select an option</option>
                      {field.options?.split(',').map(opt => (
                        <option key={opt.trim()} value={opt.trim()}>{opt.trim()}</option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      required={field.required}
                      value={customAnswers[field.label] || ''}
                      onChange={e => setCustomAnswers({...customAnswers, [field.label]: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-clarisma-gold text-black font-bold py-4 rounded-xl hover:bg-white transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Reservation'}
          </button>
        </form>
      </div>
    </div>
  );
};

const RetreatsPage: React.FC<RetreatsPageProps> = ({ onBack, onAdminAccess }) => {
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRetreat, setSelectedRetreat] = useState<Retreat | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchRetreats();
  }, []);

  const fetchRetreats = async () => {
    try {
      const res = await fetch('/api/retreats');
      if (res.ok) {
        const data = await res.json();
        // Parse tags if they come back as a string
        const parsedData = data.map((r: any) => ({
          ...r,
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : (r.tags || [])
        }));
        setRetreats(parsedData);
      }
    } catch (err) {
      console.error('Failed to fetch retreats', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto min-h-screen">
      {/* Top Navigation Row */}
      <div className="flex justify-between items-center mb-8">
        {/* Back Button */}
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-400 hover:text-clarisma-gold transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </button>

        {/* Admin Access Button */}
        <button 
          onClick={onAdminAccess}
          className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-clarisma-gold transition-colors border border-white/10 px-4 py-2 rounded-full hover:border-clarisma-gold/30"
        >
          Admin Access
        </button>
      </div>

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
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading retreats...</div>
      ) : retreats.length > 0 ? (
        <div className="grid grid-cols-1 gap-12">
          {retreats.map((retreat, index) => (
            <div 
              key={retreat.id}
              className="glass-card rounded-[2.5rem] overflow-hidden group transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 relative"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Content Container */}
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Side */}
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <div className="absolute top-4 left-4 z-10 flex gap-2 flex-wrap">
                    {retreat.tags && retreat.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <img 
                    src={retreat.image_url} 
                    alt={retreat.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
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
                    
                    {retreat.seats_available && (
                      <div className="flex items-center gap-3 text-slate-300">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-clarisma-orange">
                          <Users size={20} />
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-bold">Availability</p>
                          <p className="font-medium">{retreat.seats_available} Seats Left</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-slate-400 mb-8 leading-relaxed">
                    {retreat.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-white/10 mt-auto gap-4">
                    <div>
                      <span className="text-sm text-slate-500 block">All-inclusive package</span>
                      <span className="text-2xl font-bold text-white">{retreat.price}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {retreat.agenda_url && (
                        <a 
                          href={retreat.agenda_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-300 hover:text-clarisma-gold transition-colors flex items-center gap-2 text-sm font-medium border border-white/10 px-4 py-3 rounded-xl hover:bg-white/5"
                        >
                          <FileText size={16} />
                          Agenda
                        </a>
                      )}
                      {retreat.signup_url ? (
                        <a 
                          href={retreat.signup_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-clarisma-gold transition-colors flex items-center gap-2 group/btn shadow-lg"
                        >
                          Reserve Spot
                          <ArrowRight size={18} />
                        </a>
                      ) : (
                        <button 
                          onClick={() => setSelectedRetreat(retreat)}
                          className="bg-white text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-clarisma-gold transition-colors flex items-center gap-2 group/btn shadow-lg"
                        >
                          Reserve Spot
                          <ArrowRight size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400">
          <p className="text-xl mb-4">No retreats currently scheduled.</p>
          <p>Please check back later or inquire about custom retreats below.</p>
        </div>
      )}

      {selectedRetreat && (
        <ReservationForm 
          retreat={selectedRetreat} 
          onClose={() => setSelectedRetreat(null)} 
        />
      )}

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