import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Download, CheckCircle, XCircle, Users } from 'lucide-react';

interface Client {
  id: number;
  email: string;
  name: string;
}

interface Material {
  id: number;
  title: string;
  description: string;
  file_name: string;
  file_mime: string;
  created_at: string;
  assigned_client_ids: number[];
}

interface Submission {
  id: number;
  client_id: number;
  client_name: string;
  client_email: string;
  material_id: number | null;
  material_title: string | null;
  file_name: string;
  file_mime: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback: string;
  submitted_at: string;
  reviewed_at: string | null;
}

const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Plain <a href> links can't carry the Authorization header, so downloads
// are fetched with auth and saved via a temporary object URL instead.
const downloadFile = async (url: string, filename: string) => {
  try {
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) {
      alert('Failed to download file');
      return;
    }
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
  } catch (err) {
    console.error('Download failed', err);
    alert('Failed to download file');
  }
};

const AdminLMS: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newAssignees, setNewAssignees] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [reviewDrafts, setReviewDrafts] = useState<Record<number, string>>({});

  const fetchAll = async () => {
    try {
      const [materialsRes, clientsRes, submissionsRes] = await Promise.all([
        fetch('/api/materials', { headers: authHeaders() }),
        fetch('/api/clients', { headers: authHeaders() }),
        fetch('/api/submissions', { headers: authHeaders() }),
      ]);
      if (materialsRes.ok) setMaterials(await materialsRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
      if (submissionsRes.ok) setSubmissions(await submissionsRes.json());
    } catch (err) {
      console.error('Failed to load LMS data', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const toggleAssignee = (clientId: number) => {
    setNewAssignees(prev =>
      prev.includes(clientId) ? prev.filter(id => id !== clientId) : [...prev, clientId]
    );
  };

  const handleCreateMaterial = async () => {
    setFormError('');
    if (!newTitle.trim() || !newFile) {
      setFormError('A title and a file are required');
      return;
    }
    if (newFile.size > MAX_FILE_SIZE_BYTES) {
      setFormError('File must be under 3MB');
      return;
    }

    setIsSaving(true);
    try {
      const file_data = await fileToBase64(newFile);
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          file_name: newFile.name,
          file_mime: newFile.type || 'application/octet-stream',
          file_data,
          client_ids: newAssignees,
        }),
      });

      if (res.ok) {
        setIsCreating(false);
        setNewTitle('');
        setNewDescription('');
        setNewFile(null);
        setNewAssignees([]);
        fetchAll();
      } else {
        const body = await res.json().catch(() => ({}));
        setFormError(body?.error || `Failed to save (HTTP ${res.status})`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMaterial = async (id: number) => {
    if (!window.confirm('Delete this material? Clients will lose access to it.')) return;
    try {
      const res = await fetch(`/api/materials/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) fetchAll();
      else alert('Failed to delete material');
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAssignment = async (material: Material, clientId: number) => {
    const nextIds = material.assigned_client_ids.includes(clientId)
      ? material.assigned_client_ids.filter(id => id !== clientId)
      : [...material.assigned_client_ids, clientId];

    try {
      const res = await fetch(`/api/materials/${material.id}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ client_ids: nextIds }),
      });
      if (res.ok) fetchAll();
      else alert('Failed to update assignment');
    } catch (err) {
      console.error(err);
    }
  };

  const handleReview = async (submissionId: number, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/submissions/${submissionId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status, feedback: reviewDrafts[submissionId] || '' }),
      });
      if (res.ok) fetchAll();
      else alert('Failed to submit review');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-12">
      {/* Materials */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Learning Materials</h2>
            <p className="text-sm text-slate-400 mt-1">Upload documents and assign them to specific clients.</p>
          </div>
          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="bg-clarisma-gold text-black px-6 py-2 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              <span>New Material</span>
            </button>
          )}
        </div>

        {isCreating && (
          <div className="bg-black/40 p-6 rounded-2xl border border-white/5 mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g. Week 1: Strengths Assessment"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="What should the client do with this material?"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">File (max 3MB)</label>
                <input
                  type="file"
                  onChange={(e) => setNewFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-clarisma-gold file:text-black file:font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                  <Users size={16} /> Assign to Clients
                </label>
                {clients.length === 0 ? (
                  <p className="text-sm text-slate-500">No clients have signed up yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {clients.map(client => (
                      <label
                        key={client.id}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm ${
                          newAssignees.includes(client.id)
                            ? 'bg-clarisma-gold/20 border-clarisma-gold text-clarisma-gold'
                            : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={newAssignees.includes(client.id)}
                          onChange={() => toggleAssignee(client.id)}
                          className="accent-clarisma-gold"
                        />
                        {client.name}
                      </label>
                    ))}
                  </div>
                )}
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => { setIsCreating(false); setFormError(''); }}
                  className="px-6 py-2 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateMaterial}
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-clarisma-gold text-black font-bold hover:bg-white transition-colors disabled:opacity-60"
                >
                  {isSaving ? 'Uploading...' : 'Upload Material'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {materials.map(material => (
            <div key={material.id} className="bg-black/20 p-6 rounded-2xl border border-white/5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-white">{material.title}</h4>
                  {material.description && (
                    <p className="text-sm text-slate-400 mt-1">{material.description}</p>
                  )}
                  <button
                    onClick={() => downloadFile(`/api/materials/${material.id}/file`, material.file_name)}
                    className="inline-flex items-center gap-1 text-xs text-clarisma-gold hover:underline mt-2"
                  >
                    <Download size={12} /> {material.file_name}
                  </button>
                </div>
                <button
                  onClick={() => handleDeleteMaterial(material.id)}
                  aria-label={`Delete ${material.title}`}
                  className="p-2 border border-white/10 rounded-lg text-slate-300 hover:text-red-500 hover:border-red-500/30 transition-colors bg-white/5 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {clients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/5">
                  {clients.map(client => (
                    <label
                      key={client.id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer text-xs ${
                        material.assigned_client_ids.includes(client.id)
                          ? 'bg-clarisma-gold/20 border-clarisma-gold text-clarisma-gold'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={material.assigned_client_ids.includes(client.id)}
                        onChange={() => handleToggleAssignment(material, client.id)}
                        className="accent-clarisma-gold"
                      />
                      {client.name}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
          {materials.length === 0 && !isCreating && (
            <p className="text-slate-400">No materials yet. Add one to get started.</p>
          )}
        </div>
      </div>

      {/* Submissions */}
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Client Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-slate-400">No submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {submissions.map(sub => (
              <div key={sub.id} className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-white">{sub.client_name}</h4>
                    <p className="text-xs text-slate-400">{sub.client_email}</p>
                    {sub.material_title && (
                      <p className="text-xs text-clarisma-gold mt-1">For: {sub.material_title}</p>
                    )}
                    <button
                      onClick={() => downloadFile(`/api/submissions/${sub.id}/file`, sub.file_name)}
                      className="inline-flex items-center gap-1 text-xs text-clarisma-gold hover:underline mt-2"
                    >
                      <Download size={12} /> {sub.file_name}
                    </button>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0 ${
                    sub.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    sub.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {sub.status}
                  </span>
                </div>

                {sub.status === 'pending' ? (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <textarea
                      rows={2}
                      value={reviewDrafts[sub.id] || ''}
                      onChange={(e) => setReviewDrafts({ ...reviewDrafts, [sub.id]: e.target.value })}
                      className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-clarisma-gold mb-3"
                      placeholder="Feedback (optional)"
                    />
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReview(sub.id, 'approved')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-bold"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button
                        onClick={() => handleReview(sub.id, 'rejected')}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-bold"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </div>
                  </div>
                ) : sub.feedback ? (
                  <p className="text-sm text-slate-300 mt-4 pt-4 border-t border-white/5 italic">"{sub.feedback}"</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLMS;
