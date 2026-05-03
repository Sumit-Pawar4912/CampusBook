import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin, loading, user } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await adminLogin(form);
      addToast('Admin logged in successfully', 'success');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Admin login failed');
      addToast(err.message || 'Admin login failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Portal</h1>
          <p className="text-slate-600">CampusBook Administration</p>
        </div>

        {error && <div className="rounded-lg bg-rose-100 text-rose-700 p-3 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Admin Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-red-500 focus:ring-red-100 transition-colors"
              placeholder="admin@campusbook.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-2xl border border-slate-300 px-4 py-3 focus:border-red-500 focus:ring-red-100 transition-colors"
              placeholder="Enter admin password"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-2xl bg-red-600 py-3 text-white hover:bg-red-700 focus:bg-red-700 transition-colors font-medium"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Access Admin Panel'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-slate-600 hover:text-slate-800 transition-colors">
            ← Back to User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;