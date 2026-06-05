import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, LogOut, Eye, EyeOff } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

interface Retreat {
  id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  tags: string | string[];
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

interface Settings {
  [key: string]: string;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pseudo, setPseudo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Data state
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [settings, setSettings] = useState<Settings>({});

  // UI state
  const [activeTab, setActiveTab] = useState<'retreats' | 'settings' | 'reservations'>('retreats');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Retreat>>({});
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewingAnswers, setViewingAnswers] = useState<Reservation | null>(null);
  const [settingsFormData, setSettingsFormData] = useState<Settings>({});

  // Get token from localStorage
  const getToken = () => localStorage.getItem('adminToken');

  // Load data on auth
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
      loadAllData();
    }
  }, []);

  // Load all data from API
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [retreatsRes, settingsRes, reservationsRes] = await Promise.all([
        fetch('/api/retreats'),
        fetch('/api/settings'),
        fetch('/api/reservations', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
      ]);

      if (retreatsRes.ok) {
        const retreatsData = await retreatsRes.json();
        setRetreats(retreatsData);
      }
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setSettings(settingsData);
        setSettingsFormData(settingsData);
      }
      if (reservationsRes.ok) {
        const reservationsData = await reservationsRes.json();
        setReservations(reservationsData);
      }
      setError('');
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pseudo, password })
      });

      const data = await res.json();
      console.log("[v0] Login response:", res.status, data);

      if (res.ok && data.token) {
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setPseudo('');
        setPassword('');
        await loadAllData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      console.log("[v0] Login error:", err);
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setPseudo('');
    setPassword('');
  };

  // Create/Update retreat
  const handleSaveRetreat = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tags = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const payload = {
        ...formData,
        tags: tags.length > 0 ? tags : [],
        custom_form_schema: formData.custom_form_schema || '[]'
      };

      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/retreats/${editingId}` : '/api/retreats';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        if (editingId) {
          setRetreats(retreats.map(r => r.id === editingId ? result : r));
          setSuccess('Retreat updated successfully');
        } else {
          setRetreats([result, ...retreats]);
          setSuccess('Retreat created successfully');
        }
        resetForm();
      } else {
        setError('Failed to save retreat');
      }
    } catch (err) {
      setError('Error saving retreat');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete retreat
  const handleDeleteRetreat = async (id: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/retreats/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      });

      if (res.ok) {
        setRetreats(retreats.filter(r => r.id !== id));
        setSuccess('Retreat deleted successfully');
        setDeleteConfirm(null);
      } else {
        setError('Failed to delete retreat');
      }
    } catch (err) {
      setError('Error deleting retreat');
    } finally {
      setLoading(false);
    }
  };

  // Edit retreat
  const handleEditRetreat = (retreat: Retreat) => {
    setEditingId(retreat.id);
    setFormData(retreat);
    const tagsArray = Array.isArray(retreat.tags) ? retreat.tags : 
      (typeof retreat.tags === 'string' ? JSON.parse(retreat.tags || '[]') : []);
    setTagsInput(tagsArray.join(', '));
    setIsCreating(true);
  };

  // Reset form
  const resetForm = () => {
    setIsCreating(false);
    setEditingId(null);
    setFormData({
      title: '',
      date: '',
      location: '',
      city: '',
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
  };

  // Update settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ settings: settingsFormData })
      });

      if (res.ok) {
        setSettings(settingsFormData);
        setSuccess('Settings updated successfully');
      } else {
        setError('Failed to update settings');
      }
    } catch (err) {
      setError('Error updating settings');
    } finally {
      setLoading(false);
    }
  };

  // Update reservation status
  const handleUpdateReservationStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        const updated = await res.json();
        setReservations(reservations.map(r => r.id === id ? updated : r));
        setSuccess('Reservation status updated');
      }
    } catch (err) {
      setError('Failed to update reservation status');
    }
  };

  // Render login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-clarisma-red via-clarisma-red to-clarisma-orange flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-clarisma-gold transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              Back
            </button>

            <h1 className="text-4xl font-black mb-2 text-white">Admin Portal</h1>
            <p className="text-white/70 mb-8">Access the CMS to manage your retreat content</p>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">Username</label>
                <input
                  type="text"
                  value={pseudo}
                  onChange={(e) => setPseudo(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-clarisma-gold transition-colors"
                  required
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-bold text-white mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-clarisma-gold transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-clarisma-gold text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-clarisma-red via-clarisma-red to-clarisma-orange p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white hover:text-clarisma-gold transition-colors"
            >
              <ArrowLeft size={24} />
              <span>Back to Website</span>
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50 px-4 py-2 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-200 hover:text-red-100">
              <X size={20} />
            </button>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-green-200 flex items-center justify-between">
            <span>{success}</span>
            <button onClick={() => setSuccess('')} className="text-green-200 hover:text-green-100">
              <X size={20} />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {(['retreats', 'settings', 'reservations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-xl font-bold transition-all capitalize ${
                activeTab === tab
                  ? 'bg-clarisma-gold text-clarisma-red'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-3xl p-8">
          {/* Retreats Tab */}
          {activeTab === 'retreats' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Manage Retreats</h2>
                {!isCreating && !editingId && (
                  <button
                    onClick={() => {
                      resetForm();
                      setIsCreating(true);
                    }}
                    className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-4 py-2 rounded-xl font-bold hover:bg-white transition-all"
                  >
                    <Plus size={20} />
                    New Retreat
                  </button>
                )}
              </div>

              {/* Create/Edit Form */}
              {(isCreating || editingId) && (
                <div className="bg-black/20 border border-white/10 rounded-2xl p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white">
                    {editingId ? 'Edit Retreat' : 'Create New Retreat'}
                  </h3>

                  <form onSubmit={handleSaveRetreat} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Title *</label>
                        <input
                          type="text"
                          value={formData.title || ''}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Date *</label>
                        <input
                          type="text"
                          value={formData.date || ''}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          placeholder="e.g., October 15-20, 2026"
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Location *</label>
                        <input
                          type="text"
                          value={formData.location || ''}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city || ''}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="e.g., Marrakech"
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Price *</label>
                        <input
                          type="text"
                          value={formData.price || ''}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="e.g., $2,500"
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Image URL</label>
                        <input
                          type="text"
                          value={formData.image_url || ''}
                          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Tags (comma separated)</label>
                        <input
                          type="text"
                          value={tagsInput}
                          onChange={(e) => setTagsInput(e.target.value)}
                          placeholder="e.g., Wellness, Leadership, Strategy"
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Signup URL</label>
                        <input
                          type="text"
                          value={formData.signup_url || ''}
                          onChange={(e) => setFormData({ ...formData, signup_url: e.target.value })}
                          placeholder="e.g., https://forms.gle/..."
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Seats Available</label>
                        <input
                          type="text"
                          value={formData.seats_available || ''}
                          onChange={(e) => setFormData({ ...formData, seats_available: e.target.value })}
                          placeholder="e.g., 15"
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Agenda PDF URL</label>
                        <input
                          type="text"
                          value={formData.agenda_url || ''}
                          onChange={(e) => setFormData({ ...formData, agenda_url: e.target.value })}
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-white mb-2">Payment Details</label>
                        <input
                          type="text"
                          value={formData.payment_details || ''}
                          onChange={(e) => setFormData({ ...formData, payment_details: e.target.value })}
                          className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">Description *</label>
                      <textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                        className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-clarisma-gold resize-none"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-2 bg-clarisma-gold text-clarisma-red px-4 py-2 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50"
                      >
                        <Save size={18} />
                        {loading ? 'Saving...' : editingId ? 'Update Retreat' : 'Create Retreat'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl font-bold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Retreats List */}
              {!isCreating && !editingId && (
                <div className="space-y-3">
                  {retreats.length === 0 ? (
                    <p className="text-white/70">No retreats yet. Create your first one!</p>
                  ) : (
                    retreats.map(retreat => (
                      <div
                        key={retreat.id}
                        className="bg-black/20 border border-white/10 rounded-xl p-4 flex items-start justify-between gap-4 hover:bg-black/30 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg">{retreat.title}</h3>
                          <p className="text-white/60 text-sm">
                            {retreat.date} • {retreat.location}, {retreat.city}
                          </p>
                          <p className="text-clarisma-gold font-semibold mt-1">{retreat.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditRetreat(retreat)}
                            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-3 py-2 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          {deleteConfirm === retreat.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeleteRetreat(retreat.id)}
                                disabled={loading}
                                className="bg-red-500/30 hover:bg-red-500/40 text-red-200 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-lg transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(retreat.id)}
                              className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 px-3 py-2 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
              <h2 className="text-3xl font-bold text-white">Global Settings</h2>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Hero Video URL</label>
                <input
                  type="text"
                  value={settingsFormData.hero_video_url || ''}
                  onChange={(e) => setSettingsFormData({
                    ...settingsFormData,
                    hero_video_url: e.target.value
                  })}
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                />
                <p className="text-white/60 text-sm mt-2">Google Drive embed URL or direct video link</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-clarisma-gold text-clarisma-red px-6 py-3 rounded-xl font-bold hover:bg-white transition-all disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </form>
          )}

          {/* Reservations Tab */}
          {activeTab === 'reservations' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white">Retreat Reservations</h2>

              {reservations.length === 0 ? (
                <p className="text-white/70">No reservations yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-white/70">
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Retreat</th>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Email</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map(reservation => (
                        <tr
                          key={reservation.id}
                          className="border-b border-white/5 hover:bg-black/20 transition-colors"
                        >
                          <td className="px-4 py-3 text-white/80">
                            {new Date(reservation.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-white font-medium">
                            {reservation.retreat_title}
                          </td>
                          <td className="px-4 py-3 text-white">{reservation.name}</td>
                          <td className="px-4 py-3 text-white/80">{reservation.email}</td>
                          <td className="px-4 py-3">
                            <select
                              value={reservation.status}
                              onChange={(e) => handleUpdateReservationStatus(reservation.id, e.target.value)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold border-0 focus:outline-none ${
                                reservation.status === 'confirmed'
                                  ? 'bg-green-500/30 text-green-200'
                                  : reservation.status === 'cancelled'
                                  ? 'bg-red-500/30 text-red-200'
                                  : 'bg-yellow-500/30 text-yellow-200'
                              }`}
                            >
                              <option value="pending">Pending</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            {reservation.answers && reservation.answers !== '{}' && (
                              <button
                                onClick={() => setViewingAnswers(reservation)}
                                className="text-clarisma-gold hover:underline text-sm"
                              >
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Viewing Answers Modal */}
              {viewingAnswers && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                  <div className="bg-clarisma-red border border-white/20 rounded-2xl p-6 max-w-md w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white">{viewingAnswers.name}&apos;s Details</h3>
                      <button
                        onClick={() => setViewingAnswers(null)}
                        className="text-white/60 hover:text-white"
                      >
                        <X size={24} />
                      </button>
                    </div>

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div>
                        <p className="text-white/60 text-sm">Email</p>
                        <p className="text-white font-medium">{viewingAnswers.email}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Phone</p>
                        <p className="text-white font-medium">{viewingAnswers.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-white/60 text-sm">Message</p>
                        <p className="text-white font-medium">{viewingAnswers.message || 'No message'}</p>
                      </div>
                      {viewingAnswers.answers && viewingAnswers.answers !== '{}' && (
                        <div>
                          <p className="text-white/60 text-sm">Form Answers</p>
                          <pre className="bg-black/30 rounded-lg p-3 text-white text-xs overflow-x-auto">
                            {JSON.stringify(JSON.parse(viewingAnswers.answers), null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
