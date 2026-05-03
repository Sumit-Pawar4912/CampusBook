import { useEffect, useMemo, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../components/ToastProvider.jsx';
import Navbar from '../components/Navbar.jsx';
import bookApi from '../services/bookApi.js';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'mostViewed', label: 'Most Viewed' },
  { value: 'priceAsc', label: 'Price: Low to High' },
  { value: 'priceDesc', label: 'Price: High to Low' },
];

const conditions = ['New', 'Like New', 'Good', 'Old'];
const types = ['Sell', 'Exchange', 'Donate'];

const BooksPage = () => {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [type, setType] = useState('');
  const [semester, setSemester] = useState('');
  const [branch, setBranch] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const { addToast } = useToast();

  // ✅ Wrap addToast so its reference stays stable
  const stableToast = useCallback((msg, type) => addToast(msg, type), []);

  const filters = useMemo(
    () => ({ search, condition, type, semester: semester ? Number(semester) : undefined, branch, sort, limit: 24, page: 1 }),
    [search, condition, type, semester, branch, sort]
  );

  useEffect(() => {
    let cancelled = false; // ✅ prevent state update if component unmounts

    const loadBooks = async () => {
      setLoading(true);
      try {
        const response = await bookApi.search(filters);
        if (!cancelled) setBooks(response.data.data || []);
      } catch (error) {
        if (!cancelled) stableToast(error.response?.data?.message || 'Unable to load books', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadBooks();

    return () => { cancelled = true; }; // ✅ cleanup
  }, [filters]); // ✅ removed addToast from deps

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 rounded-3xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Filters</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-950">Refine search</h2>
              </div>
              <button
                type="button"
                className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-200 lg:hidden"
                onClick={() => setOpenFilters(prev => !prev)}
              >
                {openFilters ? 'Hide' : 'Show'}
              </button>
            </div>
            <div className={`${openFilters ? 'block' : 'hidden'} lg:block space-y-4`}>
              <div>
                <label className="text-sm font-medium text-slate-700">Search</label>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Title, author, subject"
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Condition</label>
                <select
                  value={condition}
                  onChange={e => setCondition(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  <option value="">Any condition</option>
                  {conditions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  <option value="">Any type</option>
                  {types.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-700">Semester</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={semester}
                    onChange={e => setSemester(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="Semester"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">Branch</label>
                  <input
                    value={branch}
                    onChange={e => setBranch(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                    placeholder="Branch"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Sort by</label>
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-lg sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Listings</p>
                <h1 className="mt-2 text-3xl font-semibold text-slate-950">Books near you</h1>
              </div>
              <Link to="/add-book" className="inline-flex items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700">
                Add New Book
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton />
            ) : books.length === 0 ? (
              <div className="rounded-3xl bg-white p-6 text-center text-slate-600 shadow-lg">
                No books match your filters. Try adjusting your search or filter options.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {books.map(book => (
                  <article key={book._id} className="group overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
                    <img src={book.images?.[0]?.url} alt={book.title} className="h-56 w-full object-cover transition duration-300 group-hover:scale-105" />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-2 text-sm text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{book.condition}</span>
                        <span className="text-slate-500">₹{book.price}</span>
                      </div>
                      <h2 className="mt-4 text-xl font-semibold text-slate-950">{book.title}</h2>
                      <p className="mt-2 text-slate-600">{book.author}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1">{book.type}</span>
                        <span className="rounded-full bg-slate-100 px-3 py-1">{book.semester} sem</span>
                      </div>
                      <Link
                        to={`/books/${book._id}`}
                        className="mt-6 inline-flex rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
                      >
                        View details
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BooksPage;