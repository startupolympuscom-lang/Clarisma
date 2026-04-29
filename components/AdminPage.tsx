import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

interface AdminPageProps {
  onBack: () => void;
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

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  options?: string;
  required: boolean;
}

const AdminPage: React.FC<AdminPageProps> = ({ onBack }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Retreat>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'retreats' | 'settings' | 'reservations'>('retreats');
  const [settings, setSettings] = useState<{hero_video_url?: string}>({});
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [customFields, setCustomFields] = useState<FormField[]>([]);
  const [viewingAnswers, setViewingAnswers] = useState<Reservation | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchRetreats();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, password })
      });
      
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        fetchRetreats();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
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
    const token = localStorage.getItem('adminToken');
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
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      fetchRetreats();
      fetchSettings();
      fetchReservations();
    }
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem('adminToken');
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
    const token = localStorage.getItem('adminToken');
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

    const token = localStorage.getItem('adminToken');
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

  const handleUpdateReservationStatus = async (id: number, status: string) => {
    const token = localStorage.getItem('adminToken');
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-32 px-6 flex items-center justify-center">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 max-w-md w-full">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-clarisma-gold hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </button>
          
          <h2 className="text-3xl font-black mb-6">Admin Login</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Pseudo</label>
              <input 
                type="text" 
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                placeholder="Enter admin pseudo"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button 
              type="submit"
              className="w-full bg-clarisma-gold text-clarisma-red font-black py-3 rounded-xl hover:bg-white transition-colors"
            >
              Login
            </button>
          </form>
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

        <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
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
        </div>

        {activeTab === 'settings' ? (
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
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(retreat.id)}
                    className="bg-black/50 p-2 rounded-lg text-white hover:text-red-500 transition-colors backdrop-blur-sm"
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

export default AdminPage;
