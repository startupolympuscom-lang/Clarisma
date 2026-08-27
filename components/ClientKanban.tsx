import React, { useEffect, useState } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  due_date: string;
  assignee_id: number | null;
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

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const COLUMNS: { key: Task['status']; label: string }[] = [
  { key: 'todo', label: 'To Do' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' },
];

const ClientKanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/tasks', { headers: authHeaders() });
      if (res.ok) setTasks(await res.json());
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleMove = async (task: Task, status: Task['status']) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchTasks();
      else alert('Failed to move task');
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
    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
      <h2 className="text-2xl font-bold text-white mb-6">Your Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(col => (
          <div key={col.key} className="bg-black/20 rounded-2xl border border-white/5 p-5">
            <h3 className="font-bold text-white mb-4 uppercase text-sm tracking-wider">{col.label}</h3>
            <div className="space-y-4">
              {tasks.filter(t => t.status === col.key).map(task => (
                <div key={task.id} className="bg-black/30 p-4 rounded-2xl border border-white/5">
                  <h4 className="font-bold text-white text-sm">{task.title}</h4>
                  {task.description && (
                    <p className="text-xs text-slate-400 mt-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    {task.created_by_name && (
                      <span className="text-xs text-clarisma-gold">From: {task.created_by_name}</span>
                    )}
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

      {tasks.length === 0 && (
        <p className="text-slate-400 mt-6">No tasks assigned to you yet.</p>
      )}

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

export default ClientKanban;
