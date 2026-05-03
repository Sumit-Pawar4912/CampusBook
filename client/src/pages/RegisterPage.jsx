import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, loading, user } = useAuth();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', semester: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await register({ ...form, semester: Number(form.semester) });
      addToast('Registration successful', 'success');
      navigate('/dashboard');
    } catch (err) {
      const message = err.message || err.response?.data?.message || 'Registration failed';
      setError(message);
      addToast(message, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-semibold mb-4">Create an Account</h1>
        {error && <div className="rounded-lg bg-rose-100 text-rose-700 p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full name"
            className="rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email address"
            className="rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="college"
            value={form.college}
            onChange={handleChange}
            placeholder="College name"
            className="rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            name="branch"
            value={form.branch}
            onChange={handleChange}
            placeholder="Branch"
            className="rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <input
            type="number"
            name="semester"
            value={form.semester}
            onChange={handleChange}
            placeholder="Semester"
            min="1"
            max="12"
            className="rounded-2xl border border-slate-300 px-4 py-3"
            required
          />
          <button type="submit" className="rounded-2xl bg-sky-600 py-3 text-white hover:bg-sky-700" disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
