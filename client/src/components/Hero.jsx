import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.24),_transparent_60%)]" />
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="relative z-10">
          <p className="mb-4 inline-flex rounded-full border border-emerald-500 bg-emerald-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">
            College-friendly marketplace
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            CampusBook: Buy, Sell, Exchange & Donate Books in Your College
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Unlock a trusted campus marketplace where students share textbooks, exchange notes, donate books, and discover smart pricing powered by intelligent tools.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/books')}
              className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-500 hover:bg-slate-800"
            >
              Browse Books
            </button>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="group rounded-[2rem] bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 transition duration-300 hover:-translate-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Verified</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">College verified profiles</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Every student joins with validated campus identity for safer swaps and trust.</p>
          </div>
          <div className="group rounded-[2rem] bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 transition duration-300 hover:-translate-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Smart</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">AI tools for every book</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Scan covers, compare prices, and choose the best campus pickup with modern AI-assisted insights.</p>
          </div>
          <div className="group rounded-[2rem] bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 transition duration-300 hover:-translate-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Community</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Wishlist & trusted exchange</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Find popular campus books, save favorites, and coordinate meet-ups with ease.</p>
          </div>
          <div className="group rounded-[2rem] bg-slate-900/85 p-6 shadow-2xl shadow-slate-950/30 ring-1 ring-white/10 transition duration-300 hover:-translate-y-2">
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Fast</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">Instant campus listings</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Search or post textbooks quickly and connect with classmates near you.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
