import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import NotificationDropdown from './NotificationDropdown.jsx';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'How It Works', to: '#how-it-works' },
  { label: 'Features', to: '#features' },
  { label: 'AI Smart Features', to: '#ai-features' },
  { label: 'Trust & Safety', to: '#trust-safety' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLinkClick = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-semibold tracking-tight text-white">
          CampusBook
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-lg p-2 text-slate-300 hover:bg-slate-800 hover:text-white md:hidden"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span className="text-2xl">{open ? '✕' : '☰'}</span>
        </button>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(item => (
            <a
              key={item.label}
              href={item.to}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
          <Link
            to="/books"
            className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400"
          >
            Browse Books
          </Link>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <NotificationDropdown />
              <Link
                to="/dashboard"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="rounded-full bg-slate-700 px-4 py-2 text-sm text-white transition hover:bg-slate-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-800 bg-slate-950/95 md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {navItems.map(item => (
              <a
                key={item.label}
                href={item.to}
                onClick={handleLinkClick}
                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800"
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/books"
              onClick={handleLinkClick}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
            >
              Browse Books
            </Link>
            {user ? (
              <>
                <div className="px-3 py-2">
                  <NotificationDropdown />
                </div>
                <Link
                  to="/dashboard"
                  onClick={handleLinkClick}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logout();
                    handleLinkClick();
                  }}
                  className="rounded-xl bg-slate-700 px-3 py-2 text-sm text-white transition hover:bg-slate-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
