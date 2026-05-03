import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xl font-semibold text-white">CampusBook</p>
        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
          A college-first marketplace for buying, selling, exchanging and donating books with trust and community safety.
        </p>
      </div>
      <div className="flex flex-wrap gap-4 text-sm">
        <Link to="/" className="transition hover:text-white">Home</Link>
        <Link to="/books" className="transition hover:text-white">Browse Books</Link>
        <Link to="/login" className="transition hover:text-white">Login</Link>
        <Link to="/register" className="transition hover:text-white">Register</Link>
      </div>
    </div>
    <div className="border-t border-slate-800 bg-slate-900 px-4 py-6 text-center text-sm text-slate-500 sm:px-6">
      © 2026 CampusBook. Built for campus communities.
    </div>
  </footer>
);

export default Footer;
