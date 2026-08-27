import React, { useEffect, useState } from 'react';
import { Download, Upload, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Material {
  id: number;
  title: string;
  description: string;
  file_name: string;
  file_mime: string;
  created_at: string;
}

interface Submission {
  id: number;
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

const statusBadge = (status: Submission['status']) => {
  if (status === 'approved') {
    return <span className="flex items-center gap-1 text-xs font-bold text-green-400"><CheckCircle size={14} /> Approved</span>;
  }
  if (status === 'rejected') {
    return <span className="flex items-center gap-1 text-xs font-bold text-red-400"><XCircle size={14} /> Needs revision</span>;
  }
  return <span className="flex items-center gap-1 text-xs font-bold text-yellow-400"><Clock size={14} /> Pending review</span>;
};

const ClientLMS: React.FC = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [uploadingFor, setUploadingFor] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchAll = async () => {
    try {
      const [materialsRes, submissionsRes] = await Promise.all([
        fetch('/api/materials', { headers: authHeaders() }),
        fetch('/api/submissions', { headers: authHeaders() }),
      ]);
      if (materialsRes.ok) setMaterials(await materialsRes.json());
      if (submissionsRes.ok) setSubmissions(await submissionsRes.json());
    } catch (err) {
      console.error('Failed to load materials', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUpload = async (materialId: number, file: File | undefined) => {
    setError('');
    if (!file) return;
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError('File must be under 3MB');
      return;
    }

    setUploadingFor(materialId);
    try {
      const file_data = await fileToBase64(file);
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          material_id: materialId,
          file_name: file.name,
          file_mime: file.type || 'application/octet-stream',
          file_data,
        }),
      });

      if (res.ok) {
        fetchAll();
      } else {
        const body = await res.json().catch(() => ({}));
        setError(body?.error || `Upload failed (HTTP ${res.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingFor(null);
    }
  };

  const submissionsFor = (materialId: number) =>
    submissions.filter(s => s.material_id === materialId).sort((a, b) => b.submitted_at.localeCompare(a.submitted_at));

  return (
    <div className="min-h-screen pt-32 px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Your Learning Materials</h1>
        <p className="text-slate-400 mb-10">Review each material, then upload your response for Dr. Harbon to check.</p>

        {error && <p className="text-red-500 text-sm mb-6">{error}</p>}

        {materials.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
            <p className="text-white/40">Nothing has been assigned to you yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {materials.map(material => {
              const mySubmissions = submissionsFor(material.id);
              const latest = mySubmissions[0];
              return (
                <div key={material.id} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">{material.title}</h3>
                      {material.description && (
                        <p className="text-sm text-slate-400 mt-1">{material.description}</p>
                      )}
                      <button
                        onClick={() => downloadFile(`/api/materials/${material.id}/file`, material.file_name)}
                        className="inline-flex items-center gap-1 text-xs text-clarisma-gold hover:underline mt-3"
                      >
                        <Download size={12} /> {material.file_name}
                      </button>
                    </div>
                    {latest && statusBadge(latest.status)}
                  </div>

                  {latest?.status === 'rejected' && latest.feedback && (
                    <p className="text-sm text-slate-300 mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl italic">
                      "{latest.feedback}"
                    </p>
                  )}
                  {latest?.status === 'approved' && latest.feedback && (
                    <p className="text-sm text-slate-300 mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-xl italic">
                      "{latest.feedback}"
                    </p>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/5">
                    <label className="inline-flex items-center gap-2 text-sm font-bold text-clarisma-gold cursor-pointer">
                      <Upload size={16} />
                      {uploadingFor === material.id
                        ? 'Uploading...'
                        : latest && latest.status !== 'rejected'
                        ? 'Upload a new version'
                        : 'Upload your answer'}
                      <input
                        type="file"
                        className="hidden"
                        disabled={uploadingFor === material.id}
                        onChange={(e) => handleUpload(material.id, e.target.files?.[0])}
                      />
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientLMS;
