import Navbar from '../components/Navbar.jsx';
import Hero from '../components/Hero.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import Footer from '../components/Footer.jsx';

const howSteps = [
  {
    title: 'Verify college profile',
    description: 'Create your campus account and confirm your student affiliation for a safer marketplace.',
    icon: '🎓',
  },
  {
    title: 'List or search books',
    description: 'Post textbooks, notes, or search listings from peers across your college.',
    icon: '📚',
  },
  {
    title: 'Reserve and meet on campus',
    description: 'Reserve the book, chat securely, and complete the exchange on campus.',
    icon: '🤝',
  },
];

const featureList = [
  {
    title: 'College verified marketplace',
    description: 'Only campus-verified students can list or request books for safer transactions.',
    icon: '✅',
  },
  {
    title: 'Book exchange/donation',
    description: 'Support fellow students with fast book exchanges and donation listings.',
    icon: '♻️',
  },
  {
    title: 'Smart price suggestion',
    description: 'Get intelligent pricing recommendations from real approved listings.',
    icon: '💡',
  },
  {
    title: 'OCR book scanner',
    description: 'Scan book covers or pages to identify title and author instantly.',
    icon: '📷',
  },
  {
    title: 'Wishlist',
    description: 'Save favorites and track trending campus books that students love.',
    icon: '💖',
  },
  {
    title: 'Trust score',
    description: 'Build confidence with ratings and active community trust signals.',
    icon: '⭐',
  },
];

const aiFeatures = [
  {
    title: 'OCR Book Scanner',
    description: 'Upload a cover image to extract title and author automatically.',
  },
  {
    title: 'Image Quality Checker',
    description: 'Detect blur and make sure your book photos are clear before posting.',
  },
  {
    title: 'Price Suggestion',
    description: 'Receive data-driven price guidance based on campus listings.',
  },
  {
    title: 'Trending Book Insights',
    description: 'See what books are hot based on views, wishlists, and search interest.',
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main>
        <Hero />

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-500">How it works</p>
            <h2 className="mt-4 text-4xl font-extrabold text-slate-950 sm:text-5xl">Start moving books across campus in three simple steps</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">CampusBook makes listing, searching, and reserving books intuitive and safe for campus communities.</p>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {howSteps.map(step => (
              <div key={step.title} className="group rounded-3xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 transition duration-300 hover:-translate-y-2 hover:border-emerald-200">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-2xl shadow-sm shadow-emerald-200/60">
                  {step.icon}
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-400">Features</p>
              <h2 className="mt-4 text-4xl font-extrabold sm:text-5xl">A modern campus marketplace built to simplify book trading</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">From donations to exchanges, CampusBook supports the entire student book lifecycle with safety and smart experiences.</p>
            </div>
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {featureList.map(feature => (
                <FeatureCard
                  key={feature.title}
                  icon={<span className="text-2xl">{feature.icon}</span>}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="ai-features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-500">AI Smart Features</p>
              <h2 className="mt-4 text-4xl font-extrabold text-slate-950 sm:text-5xl">Intelligent tools to help students list, price and discover books faster</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">Leverage OCR scanning, blur detection, price guidance and trending insights designed for campus book commerce.</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {aiFeatures.map(item => (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition duration-300 hover:-translate-y-1 hover:border-emerald-300">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-500">AI</p>
                  <h3 className="mt-4 text-xl font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="trust-safety" className="bg-slate-900 text-slate-100">
          <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-400">Trust & Safety</p>
                <h2 className="mt-4 text-4xl font-extrabold text-white sm:text-5xl">Campus safety is at the center of every exchange</h2>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">Verified members, transparent ratings and campus-only listings help students trade with confidence in a trusted environment.</p>
              </div>
              <div className="grid gap-5">
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/30">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Verified profiles</p>
                  <p className="mt-3 text-lg font-semibold text-white">Verified college accounts ensure only genuine student listings.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/30">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Trust score</p>
                  <p className="mt-3 text-lg font-semibold text-white">Build and display reliability through ratings and successful transactions.</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-xl shadow-slate-950/30">
                  <p className="text-sm uppercase tracking-[0.24em] text-emerald-300">Safe meetups</p>
                  <p className="mt-3 text-lg font-semibold text-white">Coordinate campus pickups and keep all interactions within your college community.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
