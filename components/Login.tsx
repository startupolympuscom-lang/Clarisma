import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('authToken', data.token);
        navigate('/portal');
      } else {
        let detail = '';
        try {
          const body = await res.text();
          detail = body ? `: ${body.slice(0, 200)}` : '';
        } catch (parseErr) {
          // ignore, use empty detail
        }
        setError(`Login failed (HTTP ${res.status})${detail}`);
      }
    } catch (err) {
      setError(`Network error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 px-6 flex items-center justify-center">
      <div className="bg-white/5 p-8 rounded-3xl border border-white/10 max-w-md w-full">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-clarisma-gold hover:text-white transition-colors mb-8"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        <h2 className="text-3xl font-black mb-6">Login</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
              placeholder="you@example.com"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-clarisma-gold"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-clarisma-gold text-clarisma-red font-black py-3 rounded-xl hover:bg-white transition-colors disabled:opacity-60"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-sm text-slate-400 mt-6 text-center">
          New client?{' '}
          <button onClick={() => navigate('/signup')} className="text-clarisma-gold hover:underline font-bold">
            Create an account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
