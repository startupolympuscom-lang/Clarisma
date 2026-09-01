import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import AdminLMS from './AdminLMS';
import ClientLMS from './ClientLMS';
import AdminKanban from './AdminKanban';
import ClientKanban from './ClientKanban';

interface PortalProps {
  onBack: () => void;
  onUnauthorized: () => void;
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

interface Reservation {
  id: number;
  retreat_id: number;
  retreat_title: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  answers: string;
  status: string;
  created_at: string;
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
}

interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  download_url: string;
  category: string;
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string;
  required: boolean;
}

const Portal: React.FC<PortalProps> = ({ onBack, onUnauthorized }) => {
  const [role, setRole] = useState<'admin' | 'client' | null>(null);
  const [myUserId, setMyUserId] = useState<number | null>(null);
  const [myName, setMyName] = useState('');
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Retreat>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<'retreats' | 'settings' | 'reservations' | 'shop' | 'landing' | 'services' | 'lms' | 'kanban'>('retreats');
  const [settings, setSettings] = useState<any>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [viewingAnswers, setViewingAnswers] = useState<Reservation | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [isEditingProduct, setIsEditingProduct] = useState<number | null>(null);
  const [editProductForm, setEditProductForm] = useState<Partial<Product>>({});
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);

  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isEditingTestimonial, setIsEditingTestimonial] = useState<number | null>(null);
  const [editTestimonialForm, setEditTestimonialForm] = useState<Partial<Testimonial>>({});
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);

  const [services, setServices] = useState<any[]>([]);
  const [isEditingService, setIsEditingService] = useState<number | null>(null);
  const [editServiceForm, setEditServiceForm] = useState<any>({});
  const [isCreatingService, setIsCreatingService] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    onUnauthorized();
  };

  const fetchRetreats = async () => {
    try {
      const res = await fetch('/api/retreats');
      if (res.ok) {
        const data = await res.json();
        // Parse tags if they come back as a string
        const parsedData = data.map((r: any) => ({
          ...r,
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags
        }));
        setRetreats(parsedData);
      }
    } catch (err) {
      console.error('Failed to fetch retreats', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  const fetchReservations = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    try {
      const res = await fetch('/api/reservations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setReservations(data);
      }
    } catch (err) {
      console.error('Failed to fetch reservations', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('authToken', 'admin-bypass-token');
    setRole('admin');
    setMyUserId(1);
    setMyName('Admin');
    fetchRetreats();
    fetchSettings();
    fetchReservations();
    fetchProducts();
    fetchServices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials');
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials', err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/services');
      if (res.ok) {
        const data = await res.json();
        const parsedServices = data.map((s: any) => ({
          ...s,
          items: typeof s.items === 'string' ? JSON.parse(s.items) : s.items
        }));
        setServices(parsedServices);
      }
    } catch (err) {
      console.error('Failed to fetch services', err);
    }
  };

  const handleSaveService = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const url = isEditingService ? `/api/services/${isEditingService}` : '/api/services';
      const method = isEditingService ? 'PUT' : 'POST';

      const payload = {
        ...editServiceForm,
        items: JSON.stringify(editServiceForm.items || [])
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsEditingService(null);
        setIsCreatingService(false);
        setEditServiceForm({});
        fetchServices();
      } else {
        alert('Failed to save service');
      }
    } catch (err) {
      console.error('Error saving service', err);
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchServices();
      } else {
        alert('Failed to delete service');
      }
    } catch (err) {
      console.error('Error deleting service', err);
    }
  };

  const handleSaveTestimonial = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const url = isEditingTestimonial ? `/api/testimonials/${isEditingTestimonial}` : '/api/testimonials';
      const method = isEditingTestimonial ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editTestimonialForm)
      });

      if (res.ok) {
        setIsEditingTestimonial(null);
        setIsCreatingTestimonial(false);
        setEditTestimonialForm({});
        fetchTestimonials();
      } else {
        alert('Failed to save testimonial');
      }
    } catch (err) {
      console.error('Error saving testimonial', err);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchTestimonials();
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (err) {
      console.error('Error deleting testimonial', err);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const url = isEditing ? `/api/retreats/${isEditing}` : '/api/retreats';
      const method = isEditing ? 'PUT' : 'POST';

      const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t);
      const payload = { ...editForm, tags, custom_form_schema: JSON.stringify(customFields) };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsEditing(null);
        setIsCreating(false);
        setEditForm({});
        setTagsInput('');
        fetchRetreats();
      } else {
        alert('Failed to save retreat');
      }
    } catch (err) {
      console.error('Error saving retreat', err);
    }
  };

  const handleSaveSettings = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;
    
    setIsSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ settings })
      });
      
      if (res.ok) {
        alert('Settings saved successfully!');
      } else {
        alert('Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings', err);
      alert('An error occurred while saving settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this retreat?')) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/retreats/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchRetreats();
      } else {
        alert('Failed to delete retreat');
      }
    } catch (err) {
      console.error('Error deleting retreat', err);
    }
  };

  const handleSaveProduct = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const url = isEditingProduct ? `/api/products/${isEditingProduct}` : '/api/products';
      const method = isEditingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editProductForm)
      });

      if (res.ok) {
        setIsEditingProduct(null);
        setIsCreatingProduct(false);
        setEditProductForm({});
        fetchProducts();
      } else {
        alert('Failed to save product');
      }
    } catch (err) {
      console.error('Error saving product', err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        fetchProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product', err);
    }
  };

  const handleUpdateReservationStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        fetchReservations();
      } else {
        alert('Failed to update reservation status');
      }
    } catch (err) {
      console.error('Error updating reservation', err);
    }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { id: Date.now().toString(), label: '', type: 'text', required: false }]);
  };

  const updateCustomField = (id: string, key: keyof FormField, value: any) => {
    setCustomFields(customFields.map(f => f.id === id ? { ...f, [key]: value } : f));
  };

  const removeCustomField = (id: string) => {
    setCustomFields(customFields.filter(f => f.id !== id));
  };

  if (role === null) {
    return (
      <div className="min-h-screen pt-32 px-6 flex items-center justify-center text-slate-400">
        Loading...
      </div>
    );
  }

  if (role !== 'admin') {
    return (
      <div className="relative">
        <div className="absolute top-32 left-6 right-6 max-w-4xl mx-auto flex justify-between items-center z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-clarisma-gold hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors bg-clarisma-red"
          >
            Logout
          </button>
        </div>
        <ClientLMS />
        <div className="max-w-4xl mx-auto px-6 pb-20">
          <ClientKanban />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-clarisma-gold hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          
          <button 
            onClick={handleLogout}
            className="text-sm border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('retreats')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'retreats' 
                ? 'bg-clarisma-gold text-black' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Manage Retreats
          </button>
          <button
            onClick={() => setActiveTab('landing')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'landing' 
                ? 'bg-clarisma-gold text-black' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Manage Landing Page
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'settings' 
                ? 'bg-clarisma-gold text-black' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Global Settings
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'reservations' 
                ? 'bg-clarisma-gold text-black' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Reservations
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'shop' 
                ? 'bg-clarisma-gold text-black' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Manage Shop
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'services'
                ? 'bg-clarisma-gold text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Manage Services
          </button>
          <button
            onClick={() => setActiveTab('lms')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'lms'
                ? 'bg-clarisma-gold text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Learning Materials
          </button>
          <button
            onClick={() => setActiveTab('kanban')}
            className={`px-6 py-2 rounded-full font-bold transition-colors ${
              activeTab === 'kanban'
                ? 'bg-clarisma-gold text-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Kanban
          </button>
        </div>

        {activeTab === 'lms' ? (
          <AdminLMS />
        ) : activeTab === 'kanban' ? (
          <AdminKanban myUserId={myUserId} myName={myName} />
        ) : activeTab === 'landing' ? (
          <div className="space-y-12">
            {/* Section 1: Texts & Headings */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-bold mb-6">Landing Page Sections Visibility</h2>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8 max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'show_hero', label: 'Hero Section' },
                  { key: 'show_about', label: 'About Section' },
                  { key: 'show_services', label: 'Services' },
                  { key: 'show_target_audience', label: 'Target Audience' },
                  { key: 'show_specialized_programs', label: 'Programs' },
                  { key: 'show_process', label: 'Methodology' },
                  { key: 'show_ikigai', label: 'Ikigai Chart' },
                  { key: 'show_testimonials', label: 'Testimonials' },
                  { key: 'show_contact', label: 'Contact' }
                ].map(section => (
                  <label key={section.key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings[section.key] !== 'false'}
                      onChange={(e) => setSettings({...settings, [section.key]: e.target.checked ? 'true' : 'false'})}
                      className="w-5 h-5 accent-clarisma-gold rounded bg-black/50 border-white/20"
                    />
                    <span className="text-sm font-medium">{section.label}</span>
                  </label>
                ))}
              </div>

              <h2 className="text-2xl font-bold mb-6">Landing Page Content & Texts</h2>
              
              <div className="space-y-8 max-w-4xl">
                {/* Hero section customization */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-lg font-bold text-clarisma-gold mb-4 uppercase tracking-wider">1. Hero Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Hero Title (Static Text)</label>
                      <input 
                        type="text" 
                        value={settings.hero_title || ''}
                        onChange={(e) => setSettings({...settings, hero_title: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., OWN YOUR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Hero Title (Italic Accent)</label>
                      <input 
                        type="text" 
                        value={settings.hero_title_italic || ''}
                        onChange={(e) => setSettings({...settings, hero_title_italic: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., NARRATIVE."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">Hero Description</label>
                      <textarea 
                        rows={3}
                        value={settings.hero_desc || ''}
                        onChange={(e) => setSettings({...settings, hero_desc: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="Hero subtitle description"
                      />
                    </div>
                  </div>
                </div>

                {/* About section customization */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-lg font-bold text-clarisma-gold mb-4 uppercase tracking-wider">2. About Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">About Section Badge</label>
                      <input 
                        type="text" 
                        value={settings.about_badge || ''}
                        onChange={(e) => setSettings({...settings, about_badge: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., About Clarisma"
                      />
                    </div>
                    <div className="hidden md:block"></div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Heading Line 1</label>
                      <input 
                        type="text" 
                        value={settings.about_heading1 || ''}
                        onChange={(e) => setSettings({...settings, about_heading1: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., Clarify your charisma."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Heading Line 2 (Slate Color Highlight)</label>
                      <input 
                        type="text" 
                        value={settings.about_heading2 || ''}
                        onChange={(e) => setSettings({...settings, about_heading2: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., Magnify your impact."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">About Body Paragraph 1 (HTML allowed)</label>
                      <textarea 
                        rows={3}
                        value={settings.about_body_p1 || ''}
                        onChange={(e) => setSettings({...settings, about_body_p1: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold font-mono text-sm"
                        placeholder="First descriptive paragraph"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">About Body Paragraph 2 (HTML allowed)</label>
                      <textarea 
                        rows={3}
                        value={settings.about_body_p2 || ''}
                        onChange={(e) => setSettings({...settings, about_body_p2: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold font-mono text-sm"
                        placeholder="Second descriptive paragraph"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Founder Bio Card Name</label>
                      <input 
                        type="text" 
                        value={settings.about_founder_name || ''}
                        onChange={(e) => setSettings({...settings, about_founder_name: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., Dr. Claris Harbon"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Founder Bio Card Subtitle</label>
                      <input 
                        type="text" 
                        value={settings.about_founder_title || ''}
                        onChange={(e) => setSettings({...settings, about_founder_title: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="Founder title/academic bio line"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">Founder Image URL</label>
                      <input 
                        type="text" 
                        value={settings.about_founder_image_url || ''}
                        onChange={(e) => setSettings({...settings, about_founder_image_url: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="https://example.com/founder.jpg"
                      />
                    </div>
                  </div>
                </div>

                {/* Services Customization */}
                <div className="border-b border-white/10 pb-6">
                  <h3 className="text-lg font-bold text-clarisma-gold mb-4 uppercase tracking-wider">3. Services Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Title Line 1</label>
                      <input 
                        type="text" 
                        value={settings.services_title_1 || ''}
                        onChange={(e) => setSettings({...settings, services_title_1: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., LEVEL UP"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Title Line 2</label>
                      <input 
                        type="text" 
                        value={settings.services_title_2 || ''}
                        onChange={(e) => setSettings({...settings, services_title_2: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., YOUR"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Title Highlight</label>
                      <input 
                        type="text" 
                        value={settings.services_title_highlight || ''}
                        onChange={(e) => setSettings({...settings, services_title_highlight: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., IMPACT."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">Description</label>
                      <textarea 
                        rows={3}
                        value={settings.services_desc || ''}
                        onChange={(e) => setSettings({...settings, services_desc: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="Services description..."
                      />
                    </div>
                  </div>
                </div>

                {/* Methodology Customization */}
                <div className="pb-6">
                  <h3 className="text-lg font-bold text-clarisma-gold mb-4 uppercase tracking-wider">4. Methodology (Process) Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold mb-2">Methodology Badge</label>
                      <input 
                        type="text" 
                        value={settings.methodology_badge || ''}
                        onChange={(e) => setSettings({...settings, methodology_badge: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="e.g., Our Methodology"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold mb-2">Heading title</label>
                      <input 
                        type="text" 
                        value={settings.methodology_heading || ''}
                        onChange={(e) => setSettings({...settings, methodology_heading: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="Blueprint for professional mastery"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold mb-2">Description</label>
                      <textarea 
                        rows={3}
                        value={settings.methodology_desc || ''}
                        onChange={(e) => setSettings({...settings, methodology_desc: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="Short section overview"
                      />
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className="bg-clarisma-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
                >
                  <Save size={20} />
                  {isSavingSettings ? 'Saving...' : 'Save Landing Page Texts'}
                </button>
              </div>
            </div>

            {/* Section 2: Testimonial CMS (Add/Edit/Delete elements of Testimonials) */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">Client Testimonials</h2>
                  <p className="text-sm text-slate-400 mt-1">Manage core stories displayed on the landing page.</p>
                </div>
                {!isCreatingTestimonial && isEditingTestimonial === null && (
                  <button
                    onClick={() => {
                      setIsCreatingTestimonial(true);
                      setEditTestimonialForm({ quote: '', author: '', role: '', company: '' });
                    }}
                    className="bg-clarisma-gold text-black px-6 py-2 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span>Add Testimonial</span>
                  </button>
                )}
              </div>

              {/* Form panel */}
              {(isCreatingTestimonial || isEditingTestimonial !== null) && (
                <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mb-8 max-w-2xl">
                  <h3 className="text-lg font-bold mb-4">
                    {isEditingTestimonial !== null ? 'Edit Testimonial' : 'Create New Testimonial'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold mb-2">Client Quote</label>
                      <textarea
                        rows={4}
                        value={editTestimonialForm.quote || ''}
                        onChange={(e) => setEditTestimonialForm({...editTestimonialForm, quote: e.target.value})}
                        className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                        placeholder="Tell the transformation story..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold mb-2">Author Name</label>
                        <input
                          type="text"
                          value={editTestimonialForm.author || ''}
                          onChange={(e) => setEditTestimonialForm({...editTestimonialForm, author: e.target.value})}
                          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                          placeholder="e.g. Kenza Sifi"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Role/Position</label>
                        <input
                          type="text"
                          value={editTestimonialForm.role || ''}
                          onChange={(e) => setEditTestimonialForm({...editTestimonialForm, role: e.target.value})}
                          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                          placeholder="e.g. Student"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold mb-2">Institution/Company</label>
                        <input
                          type="text"
                          value={editTestimonialForm.company || ''}
                          onChange={(e) => setEditTestimonialForm({...editTestimonialForm, company: e.target.value})}
                          className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                          placeholder="e.g. Al Akhawayn Univ."
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 justify-end pt-4">
                      <button
                        onClick={() => {
                          setIsCreatingTestimonial(false);
                          setIsEditingTestimonial(null);
                          setEditTestimonialForm({});
                        }}
                        className="px-6 py-2 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveTestimonial}
                        className="px-6 py-2 rounded-xl bg-clarisma-gold text-black font-bold hover:bg-white transition-colors"
                      >
                        Save Testimonial
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of testimonials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map(item => (
                  <div key={item.id} className="bg-black/20 hover:bg-black/30 p-6 rounded-2xl border border-white/5 flex flex-col justify-between group">
                    <div>
                      <p className="text-slate-300 italic mb-6 leading-relaxed">
                        "{item.quote}"
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                      <div>
                        <h4 className="font-bold text-white text-base">{item.author}</h4>
                        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">{item.role}</p>
                        <p className="text-xs text-clarisma-gold font-semibold uppercase">{item.company}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setIsEditingTestimonial(item.id);
                            setEditTestimonialForm(item);
                            setIsCreatingTestimonial(false);
                          }}
                          className="p-2 border border-white/10 rounded-lg text-slate-300 hover:text-clarisma-gold hover:border-clarisma-gold/30 transition-colors bg-white/5"
                          aria-label={`Edit testimonial from ${item.author}`}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(item.id)}
                          className="p-2 border border-white/10 rounded-lg text-slate-300 hover:text-red-500 hover:border-red-500/30 transition-colors bg-white/5"
                          aria-label={`Delete testimonial from ${item.author}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {testimonials.length === 0 && (
                  <p className="text-slate-400">No testimonials found. Add some to display on the landing page!</p>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'settings' ? (
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Global Settings</h2>
            
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-bold mb-2">Introductory Video URL (Hero Section)</label>
                <input 
                  type="text" 
                  value={settings.hero_video_url || ''}
                  onChange={(e) => setSettings({...settings, hero_video_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., https://example.com/video.mp4"
                />
                <p className="text-sm text-slate-400 mt-2">
                  Paste the URL of the video you want to display when users click "Watch Introductory Video".
                </p>
              </div>
              
              <button 
                onClick={handleSaveSettings}
                disabled={isSavingSettings}
                className="bg-clarisma-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
              >
                <Save size={20} />
                {isSavingSettings ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </div>
        ) : activeTab === 'reservations' ? (
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
            <h2 className="text-2xl font-bold mb-6">Retreat Reservations</h2>
            
            {reservations.length === 0 ? (
              <p className="text-slate-400">No reservations found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Retreat</th>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Contact</th>
                      <th className="p-4 font-medium">Message</th>
                      <th className="p-4 font-medium">Custom Answers</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reservations.map((res) => (
                      <tr key={res.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="p-4 text-sm whitespace-nowrap">
                          {new Date(res.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-4 font-medium">{res.retreat_title}</td>
                        <td className="p-4">{res.name}</td>
                        <td className="p-4 text-sm">
                          <div>{res.email}</div>
                          <div className="text-slate-400">{res.phone}</div>
                        </td>
                        <td className="p-4 text-sm max-w-xs truncate" title={res.message}>
                          {res.message || '-'}
                        </td>
                        <td className="p-4 text-sm">
                          {res.answers && res.answers !== '{}' ? (
                            <button 
                              onClick={() => setViewingAnswers(res)}
                              className="text-clarisma-gold hover:underline"
                            >
                              View Answers
                            </button>
                          ) : (
                            <span className="text-slate-500">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                            res.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={res.status}
                            onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                            className="bg-black/50 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-clarisma-gold"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : activeTab === 'shop' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-white">Manage Digital Store</h1>
              {!isCreatingProduct && !isEditingProduct && (
                <button 
                  onClick={() => {
                    setIsCreatingProduct(true);
                    setEditProductForm({
                      title: '',
                      description: '',
                      price: '',
                      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
                      download_url: '',
                      category: 'Digital'
                    });
                  }}
                  className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-lg"
                >
                  <Plus size={20} />
                  New Product
                </button>
              )}
            </div>

            {(isCreatingProduct || isEditingProduct !== null) && (
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-12 backdrop-blur-sm">
                <h2 className="text-2xl font-bold mb-6 text-white">{isCreatingProduct ? 'Add New Product' : 'Edit Product'}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-300">Product Title</label>
                    <input 
                      type="text" 
                      value={editProductForm.title || ''}
                      onChange={(e) => setEditProductForm({...editProductForm, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold transition-colors"
                      placeholder="e.g., The Charisma Blueprint"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-300">Price (USD)</label>
                    <input 
                      type="text" 
                      value={editProductForm.price || ''}
                      onChange={(e) => setEditProductForm({...editProductForm, price: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold transition-colors"
                      placeholder="e.g., 29.99"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-300">Category</label>
                    <select 
                      value={editProductForm.category || ''}
                      onChange={(e) => setEditProductForm({...editProductForm, category: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold transition-colors"
                    >
                      <option value="">Select Category</option>
                      <option value="Intelligence Library">Intelligence Library</option>
                      <option value="Professional Toolkit">Professional Toolkit</option>
                      <option value="Clarisma Collection">Clarisma Collection</option>
                      <option value="Curated Experience Bundles">Curated Experience Bundles</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2 text-slate-300">Download/Access URL</label>
                    <input 
                      type="text" 
                      value={editProductForm.download_url || ''}
                      onChange={(e) => setEditProductForm({...editProductForm, download_url: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold transition-colors"
                      placeholder="Link to file or access portal"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-slate-300">Image URL</label>
                    <input 
                      type="text" 
                      value={editProductForm.image_url || ''}
                      onChange={(e) => setEditProductForm({...editProductForm, image_url: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2 text-slate-300">Description</label>
                    <textarea 
                      value={editProductForm.description || ''}
                      onChange={(e) => setEditProductForm({...editProductForm, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold h-32 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <button 
                    onClick={() => {
                      setIsEditingProduct(null);
                      setIsCreatingProduct(false);
                    }}
                    className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveProduct}
                    className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-8 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-lg"
                  >
                    <Save size={20} />
                    Save Product
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map(product => (
                <div key={product.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-clarisma-gold/50 transition-all flex flex-col group">
                  <div className="aspect-video relative overflow-hidden">
                    <img 
                      src={product.image_url} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={() => {
                          setIsEditingProduct(product.id);
                          setEditProductForm(product);
                          setIsCreatingProduct(false);
                          window.scrollTo(0, 0);
                        }}
                        className="bg-black/60 p-2 rounded-lg text-white hover:text-clarisma-gold transition-colors backdrop-blur-sm"
                        aria-label={`Edit ${product.title}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="bg-black/60 p-2 rounded-lg text-white hover:text-red-500 transition-colors backdrop-blur-sm"
                        aria-label={`Delete ${product.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-white mb-1">{product.title}</h3>
                      <span className="text-clarisma-gold font-bold">${product.price}</span>
                    </div>
                    <span className="text-xs bg-white/10 text-white/60 px-2 py-0.5 rounded-full w-fit mb-4 uppercase font-bold tracking-wider">{product.category}</span>
                    <p className="text-white/60 text-sm line-clamp-3 mb-4">{product.description}</p>
                    <div className="mt-auto text-xs text-white/40 truncate italic">
                      URL: {product.download_url}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && !isCreatingProduct && (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                <p className="text-white/40">No products found. Start by adding your first digital resource!</p>
              </div>
            )}
          </div>
        ) : activeTab === 'services' ? (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-white">Manage Services</h1>
              {!isCreatingService && !isEditingService && (
                <button 
                  onClick={() => {
                    setIsCreatingService(true);
                    setEditServiceForm({
                      title: '',
                      badge: '',
                      description: '',
                      icon_name: 'User',
                      items: [
                        { icon: 'Compass', title: '', desc: '' },
                        { icon: 'GraduationCap', title: '', desc: '' },
                        { icon: 'Heart', title: '', desc: '' },
                        { icon: 'Eye', title: '', desc: '' }
                      ],
                      link_text: 'Book a Session',
                      link_url: '#',
                      color_theme: 'gold',
                      order_index: (services.length + 1)
                    });
                  }}
                  className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-white transition-all shadow-lg"
                >
                  <Plus size={20} />
                  New Service
                </button>
              )}
            </div>

            {(isCreatingService || isEditingService !== null) && (
              <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-12">
                <h2 className="text-2xl font-bold mb-6">{isCreatingService ? 'Create Service' : 'Edit Service'}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold mb-2">Service Title</label>
                    <input 
                      type="text" 
                      value={editServiceForm.title || ''}
                      onChange={(e) => setEditServiceForm({...editServiceForm, title: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                      placeholder="e.g. RECLAIM YOUR CAREER"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Badge Text</label>
                    <input 
                      type="text" 
                      value={editServiceForm.badge || ''}
                      onChange={(e) => setEditServiceForm({...editServiceForm, badge: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                      placeholder="e.g. One-on-One Coaching"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold mb-2">Description</label>
                    <textarea 
                      rows={3}
                      value={editServiceForm.description || ''}
                      onChange={(e) => setEditServiceForm({...editServiceForm, description: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                      placeholder="Describe the service..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Icon Name (Lucide-react)</label>
                    <input 
                      type="text" 
                      value={editServiceForm.icon_name || 'User'}
                      onChange={(e) => setEditServiceForm({...editServiceForm, icon_name: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                      placeholder="e.g. User, Users, Compass, Shield"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Color Theme</label>
                    <select 
                      value={editServiceForm.color_theme || 'gold'}
                      onChange={(e) => setEditServiceForm({...editServiceForm, color_theme: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                    >
                      <option value="gold">Gold Theme</option>
                      <option value="orange">Orange Theme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Action Button Text</label>
                    <input 
                      type="text" 
                      value={editServiceForm.link_text || 'Book a Session'}
                      onChange={(e) => setEditServiceForm({...editServiceForm, link_text: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Action Link URL / Section Key</label>
                    <input 
                      type="text" 
                      value={editServiceForm.link_url || '#'}
                      onChange={(e) => setEditServiceForm({...editServiceForm, link_url: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                      placeholder="e.g. #contact, retreats, or full URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Display Order Index</label>
                    <input 
                      type="number" 
                      value={editServiceForm.order_index || 0}
                      onChange={(e) => setEditServiceForm({...editServiceForm, order_index: parseInt(e.target.value) || 0})}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                    />
                  </div>
                </div>

                {/* Sub features sub-form */}
                <div className="space-y-4 border-t border-white/10 pt-6 mb-8">
                  <div>
                    <h3 className="text-lg font-bold text-clarisma-gold uppercase tracking-wider">Service Highlights / Key Features</h3>
                    <p className="text-xs text-slate-400 mt-1">Specify up to 4 key highlights to display inside this bento block.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[0, 1, 2, 3].map((idx) => {
                      const item = (editServiceForm.items as any[])?.[idx] || { icon: 'Compass', title: '', desc: '' };
                      const updateItem = (field: string, val: string) => {
                        const currentItems = [...((editServiceForm.items as any[]) || [])];
                        while (currentItems.length <= idx) {
                          currentItems.push({ icon: 'Compass', title: '', desc: '' });
                        }
                        currentItems[idx] = { ...currentItems[idx], [field]: val };
                        setEditServiceForm({ ...editServiceForm, items: currentItems });
                      };

                      return (
                        <div key={idx} className="bg-black/40 p-4 rounded-2xl border border-white/5 space-y-3">
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Highlight {idx + 1}</h4>
                          <div className="grid grid-cols-1 gap-2">
                            <input
                              type="text"
                              value={item.icon || ''}
                              onChange={(e) => updateItem('icon', e.target.value)}
                              placeholder="Lucide Icon (e.g., Compass, Heart, Eye)"
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-clarisma-gold"
                            />
                            <input
                              type="text"
                              value={item.title || ''}
                              onChange={(e) => updateItem('title', e.target.value)}
                              placeholder="Feature Title (e.g., Career Clarity)"
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-clarisma-gold"
                            />
                            <input
                              type="text"
                              value={item.desc || ''}
                              onChange={(e) => updateItem('desc', e.target.value)}
                              placeholder="Short Subtitle (e.g., Strengths roadmap)"
                              className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-clarisma-gold"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={handleSaveService}
                    className="bg-clarisma-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors"
                  >
                    Save Service
                  </button>
                  <button 
                    onClick={() => {
                      setIsCreatingService(false);
                      setIsEditingService(null);
                      setEditServiceForm({});
                    }}
                    className="bg-white/10 text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white/5 p-6 rounded-3xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {service.badge && (
                          <span className="text-[10px] font-bold text-clarisma-gold border border-clarisma-gold/20 bg-clarisma-gold/10 px-2.5 py-1 rounded-full uppercase">
                            {service.badge}
                          </span>
                        )}
                        <h3 className="text-2xl font-black text-white mt-2 uppercase">{service.title}</h3>
                      </div>
                      <span className="text-slate-500 font-mono text-sm">Theme: {service.color_theme}</span>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed mb-4">{service.description}</p>
                    
                    {service.items && (
                      <div className="bg-black/30 p-3 rounded-xl border border-white/5 mb-4">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase">Highlights:</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                          {((typeof service.items === 'string' ? JSON.parse(service.items || '[]') : service.items) || []).map((feat: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 truncate">
                              <span className="text-clarisma-gold font-bold">✓</span>
                              <span className="truncate">{feat.title || 'Untitled Highlight'}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-xs text-slate-400">Order: {service.order_index}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditingService(service.id);
                          setEditServiceForm({
                            ...service,
                            items: typeof service.items === 'string' ? JSON.parse(service.items) : service.items
                          });
                          setIsCreatingService(false);
                        }}
                        className="p-2 border border-white/10 rounded-lg text-slate-300 hover:text-clarisma-gold hover:border-clarisma-gold/30 transition-colors bg-white/5"
                        aria-label={`Edit ${service.title}`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 border border-white/10 rounded-lg text-slate-300 hover:text-red-500 hover:border-red-500/30 transition-colors bg-white/5"
                        aria-label={`Delete ${service.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {services.length === 0 && !isCreatingService && (
                <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                  <p className="text-white/40">No services found. Click "New Service" to add one.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black">Manage Retreats</h1>
              {!isCreating && !isEditing && (
                <button 
                  onClick={() => {
                    setIsCreating(true);
                    setEditForm({
                      title: '',
                      date: '',
                      location: '',
                      city: '',
                      tags: [],
                      description: '',
                      image_url: 'https://picsum.photos/seed/retreat/800/600',
                      price: '',
                      signup_url: '',
                      seats_available: '',
                      agenda_url: '',
                      payment_details: '',
                      custom_form_schema: '[]'
                    });
                    setTagsInput('');
                    setCustomFields([]);
                  }}
                  className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-4 py-2 rounded-xl font-bold hover:bg-white transition-colors"
                >
                  <Plus size={20} />
                  New Retreat
                </button>
              )}
            </div>

            {(isCreating || isEditing !== null) && (
          <div className="bg-white/5 p-8 rounded-3xl border border-white/10 mb-12">
            <h2 className="text-2xl font-bold mb-6">{isCreating ? 'Create Retreat' : 'Edit Retreat'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input 
                  type="text" 
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Date</label>
                <input 
                  type="text" 
                  value={editForm.date || ''}
                  onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., October 15-20, 2026"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Location</label>
                <input 
                  type="text" 
                  value={editForm.location || ''}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">City</label>
                <input 
                  type="text" 
                  value={editForm.city || ''}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., Marrakech"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., Wellness, Leadership, Strategy"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Price</label>
                <input 
                  type="text" 
                  value={editForm.price || ''}
                  onChange={(e) => setEditForm({...editForm, price: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., $2,500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Sign Up Link (Form URL)</label>
                <input 
                  type="text" 
                  value={editForm.signup_url || ''}
                  onChange={(e) => setEditForm({...editForm, signup_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., https://forms.gle/..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Seats Available</label>
                <input 
                  type="text" 
                  value={editForm.seats_available || ''}
                  onChange={(e) => setEditForm({...editForm, seats_available: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., 15"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Agenda PDF URL</label>
                <input 
                  type="text" 
                  value={editForm.agenda_url || ''}
                  onChange={(e) => setEditForm({...editForm, agenda_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g., https://example.com/agenda.pdf"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Payment Details / Instructions</label>
                <textarea 
                  value={editForm.payment_details || ''}
                  onChange={(e) => setEditForm({...editForm, payment_details: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold h-24"
                  placeholder="e.g., Bank transfer details, payment links, or instructions for reserving a spot."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Image URL</label>
                <input 
                  type="text" 
                  value={editForm.image_url || ''}
                  onChange={(e) => setEditForm({...editForm, image_url: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea 
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold h-32"
                />
              </div>
              
              <div className="md:col-span-2 border border-white/10 p-6 rounded-2xl bg-black/20 mt-4">
                <h3 className="text-lg font-bold mb-2">Custom Registration Form</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Add custom fields to collect specific information from attendees during reservation. (Name, Email, Phone, and Message are included by default).
                </p>
                
                {customFields.map((field) => (
                  <div key={field.id} className="flex flex-wrap gap-4 mb-4 p-4 border border-white/10 rounded-xl bg-black/40 relative">
                    <button
                      onClick={() => removeCustomField(field.id)}
                      className="absolute top-3 right-3 text-red-400 hover:text-red-300 transition-colors"
                      title="Remove Field"
                      aria-label="Remove field"
                    >
                      <X size={18} />
                    </button>
                    <div className="flex-1 min-w-[200px]">
                      <label className="block text-xs font-bold mb-1">Field Label</label>
                      <input 
                        type="text" 
                        value={field.label} 
                        onChange={e => updateCustomField(field.id, 'label', e.target.value)} 
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold text-sm" 
                        placeholder="e.g., Dietary Restrictions"
                      />
                    </div>
                    <div className="w-40">
                      <label className="block text-xs font-bold mb-1">Type</label>
                      <select 
                        value={field.type} 
                        onChange={e => updateCustomField(field.id, 'type', e.target.value)} 
                        className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold text-sm"
                      >
                        <option value="text">Short Text</option>
                        <option value="textarea">Long Text</option>
                        <option value="select">Dropdown</option>
                      </select>
                    </div>
                    {field.type === 'select' && (
                      <div className="flex-1 min-w-[200px]">
                        <label className="block text-xs font-bold mb-1">Options (comma separated)</label>
                        <input 
                          type="text" 
                          value={field.options || ''} 
                          onChange={e => updateCustomField(field.id, 'options', e.target.value)} 
                          className="w-full bg-black/50 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold text-sm" 
                          placeholder="e.g., Vegan, Vegetarian, None"
                        />
                      </div>
                    )}
                    <div className="w-24 flex items-end pb-2">
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={field.required} 
                          onChange={e => updateCustomField(field.id, 'required', e.target.checked)} 
                          className="rounded border-white/20 bg-black/50 text-clarisma-gold focus:ring-clarisma-gold"
                        />
                        Required
                      </label>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={addCustomField} 
                  className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Custom Field
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button 
                onClick={() => {
                  setIsEditing(null);
                  setIsCreating(false);
                }}
                className="px-6 py-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors"
              >
                <Save size={20} />
                Save Retreat
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {retreats.map(retreat => (
            <div key={retreat.id} className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex flex-col">
              <div className="h-48 overflow-hidden relative">
                <img 
                  src={retreat.image_url} 
                  alt={retreat.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => {
                      setIsEditing(retreat.id);
                      setEditForm(retreat);
                      setTagsInput((retreat.tags || []).join(', '));
                      setCustomFields(retreat.custom_form_schema ? JSON.parse(retreat.custom_form_schema) : []);
                      setIsCreating(false);
                      window.scrollTo(0, 0);
                    }}
                    className="bg-black/50 p-2 rounded-lg text-white hover:text-clarisma-gold transition-colors backdrop-blur-sm"
                    aria-label={`Edit ${retreat.title}`}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(retreat.id)}
                    className="bg-black/50 p-2 rounded-lg text-white hover:text-red-500 transition-colors backdrop-blur-sm"
                    aria-label={`Delete ${retreat.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-2">{retreat.title}</h3>
                <p className="text-sm text-clarisma-gold mb-1">{retreat.date}</p>
                <p className="text-sm text-slate-300 mb-4">{retreat.location}</p>
                <p className="text-sm text-slate-400 line-clamp-3 mb-4">{retreat.description}</p>
                <div className="mt-auto pt-4 border-t border-white/10 font-bold">
                  {retreat.price}
                </div>
              </div>
            </div>
          ))}
          {retreats.length === 0 && !isCreating && (
            <div className="col-span-full text-center py-12 text-slate-400">
              No retreats found. Click "New Retreat" to add one.
            </div>
          )}
        </div>
        </>
        )}
      </div>

      {/* Answers Modal */}
      {viewingAnswers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-lg w-full relative">
            <button
              onClick={() => setViewingAnswers(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl font-bold mb-6">Reservation Details</h3>
            
            <div className="space-y-4 mb-8">
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Name</p>
                <p className="font-medium">{viewingAnswers.name}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                <p className="font-medium">{viewingAnswers.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Phone</p>
                <p className="font-medium">{viewingAnswers.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Message</p>
                <p className="font-medium whitespace-pre-wrap">{viewingAnswers.message || '-'}</p>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <h4 className="font-bold text-clarisma-gold mb-4">Custom Form Answers</h4>
                {viewingAnswers.answers && viewingAnswers.answers !== '{}' ? (
                  <div className="space-y-4">
                    {Object.entries(JSON.parse(viewingAnswers.answers)).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-slate-400 uppercase font-bold">{key}</p>
                        <p className="font-medium whitespace-pre-wrap">{String(value) || '-'}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">No custom answers provided.</p>
                )}
              </div>
            </div>
            
            <button 
              onClick={() => setViewingAnswers(null)}
              className="w-full bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
