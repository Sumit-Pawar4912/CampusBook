import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, adminLogin, loading, user } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isAdmin) {
        await adminLogin(form);
        addToast('Admin logged in successfully', 'success');
        navigate('/admin');
      } else {
        await login(form);
        addToast('Logged in successfully', 'success');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      addToast(err.message || 'Login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold mb-4">CampusBook Login</h1>
        {error && <div className="rounded-lg bg-rose-100 text-rose-700 p-3 mb-4">{error}</div>}

        <div className="mb-6 flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="loginMode"
              checked={!isAdmin}
              onChange={() => setIsAdmin(false)}
              className="h-4 w-4 text-sky-600"
            />
            User
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="loginMode"
              checked={isAdmin}
              onChange={() => setIsAdmin(true)}
              className="h-4 w-4 text-sky-600"
            />
            Admin
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-sky-500 focus:ring-sky-100"
              required
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-sky-500 focus:ring-sky-100"
              required
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-2xl bg-sky-600 py-3 text-white hover:bg-sky-700"
            disabled={loading}
          >
            {loading ? 'Signing in…' : isAdmin ? 'Sign in as Admin' : 'Sign in'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          New to CampusBook?{' '}
          <Link to="/register" className="text-sky-600 hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
