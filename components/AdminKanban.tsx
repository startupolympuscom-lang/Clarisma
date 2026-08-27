import React, { useEffect, useState } from 'react';
import { Plus, Trash2, MessageSquare, X, Send } from 'lucide-react';

interface Client {
  id: number;
  email: string;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
  assignee_id: number | null;
  assignee_name: string | null;
  created_by: number | null;
  created_by_name: string | null;
  created_at: string;
}

interface Comment {
  id: number;
  task_id: number;
  body: string;
  created_at: string;
  author_id: number;
  author_name: string;
  author_role: string;
}

interface AdminKanbanProps {
  myUserId: number | null;
  myName: string;
}

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const COLUMNS: { key: Task['status']; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const AdminKanban: React.FC<AdminKanbanProps> = ({ myUserId, myName }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState<string>('');
  const [newDueDate, setNewDueDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchAll = async () => {
    try {
      const [tasksRes, clientsRes] = await Promise.all([
        fetch('/api/tasks', { headers: authHeaders() }),
        fetch('/api/clients', { headers: authHeaders() }),
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (clientsRes.ok) setClients(await clientsRes.json());
    } catch (err) {
      console.error('Failed to load Kanban data', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreateTask = async () => {
    setFormError('');
    if (!newTitle.trim() || !newAssigneeId) {
      setFormError('A title and an assignee are required');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          assignee_id: Number(newAssigneeId),
          due_date: newDueDate,
        }),
      });

      if (res.ok) {
        setIsCreating(false);
        setNewTitle('');
        setNewDescription('');
        setNewAssigneeId('');
        setNewDueDate('');
        fetchAll();
      } else {
        const body = await res.json().catch(() => ({}));
        setFormError(body?.error || `Failed to create task (HTTP ${res.status})`);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create task');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMove = async (task: Task, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchAll();
      else alert('Failed to move task');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this task? Its comments will be removed too.')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE', headers: authHeaders() });
      if (res.ok) {
        if (activeTaskId === id) setActiveTaskId(null);
        fetchAll();
      } else {
        alert('Failed to delete task');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openComments = async (taskId: number) => {
    setActiveTaskId(taskId);
    setLoadingComments(true);
    try {
      const res = await fetch(`/api/tasks/${taskId}/comments`, { headers: authHeaders() });
      if (res.ok) setComments(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!activeTaskId || !newComment.trim()) return;
    try {
      const res = await fetch(`/api/tasks/${activeTaskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ body: newComment.trim() }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([...comments, comment]);
        setNewComment('');
      } else {
        alert('Failed to add comment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeTask = tasks.find(t => t.id === activeTaskId) || null;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Task Board</h2>
          <p className="text-sm text-slate-400 mt-1">Assign tasks to yourself or a client and track progress.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-clarisma-gold text-black px-6 py-2 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span>New Task</span>
          </button>
        )}
      </div>

      {isCreating && (
        <div className="bg-black/40 p-6 rounded-2xl border border-white/5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                placeholder="e.g. Review submitted strengths assessment"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                placeholder="Details about the task"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2">Assign To</label>
                <select
                  value={newAssigneeId}
                  onChange={(e) => setNewAssigneeId(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                >
                  <option value="">Select assignee...</option>
                  {myUserId !== null && (
                    <option value={myUserId}>{myName || 'Myself'} (me)</option>
                  )}
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Due Date (optional)</label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
                  placeholder="e.g. 2026-09-01"
                />
              </div>
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
                onClick={handleCreateTask}
                disabled={isSaving}
                className="px-6 py-2 rounded-xl bg-clarisma-gold text-black font-bold hover:bg-white transition-colors disabled:opacity-60"
              >
                {isSaving ? 'Creating...' : 'Create Task'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(col => (
          <div key={col.key} className="bg-white/5 rounded-3xl border border-white/10 p-5">
            <h3 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">{col.label}</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === col.key).map(task => (
                <div key={task.id} className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-white text-sm">{task.title}</h4>
                    <button
                      onClick={() => handleDelete(task.id)}
                      aria-label={`Delete ${task.title}`}
                      className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-400 mt-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-clarisma-gold">
                      {task.assignee_id === myUserId ? `${myName || 'Me'} (me)` : task.assignee_name || 'Unassigned'}
                    </span>
                    {task.due_date && <span className="text-xs text-slate-500">{task.due_date}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <select
                      value={task.status}
                      onChange={(e) => handleMove(task, e.target.value as Task['status'])}
                      className="bg-black/50 border border-white/20 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-clarisma-gold"
                    >
                      {COLUMNS.map(c => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => openComments(task.id)}
                      className="flex items-center gap-1 text-xs text-slate-300 hover:text-clarisma-gold transition-colors"
                    >
                      <MessageSquare size={14} /> Comments
                    </button>
                  </div>
                </div>
              ))}
              {tasks.filter(t => t.status === col.key).length === 0 && (
                <p className="text-xs text-slate-500">No tasks here.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {activeTask && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50" onClick={() => setActiveTaskId(null)}>
          <div
            className="bg-clarisma-red border border-white/10 rounded-3xl p-6 max-w-lg w-full max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{activeTask.title}</h3>
              <button onClick={() => setActiveTaskId(null)} aria-label="Close comments" className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {loadingComments ? (
                <p className="text-sm text-slate-400">Loading...</p>
              ) : comments.length === 0 ? (
                <p className="text-sm text-slate-400">No comments yet.</p>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="bg-black/20 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-clarisma-gold">{c.author_name}</span>
                      <span className="text-xs text-slate-500">{new Date(c.created_at).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-200">{c.body}</p>
                  </div>
                ))
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(); }}
                className="flex-1 bg-black/50 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-clarisma-gold"
                placeholder="Write a comment..."
              />
              <button
                onClick={handleAddComment}
                aria-label="Send comment"
                className="bg-clarisma-gold text-black p-2 rounded-xl hover:bg-white transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminKanban;
