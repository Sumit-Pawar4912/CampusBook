import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import bookApi from '../services/bookApi.js';
import wishlistApi from '../services/wishlistApi.js';
import transactionApi from '../services/transactionApi.js';
import chatApi from '../services/chatApi.js';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/ToastProvider.jsx';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState({ myListings: 0, wishlist: 0, transactions: 0 });
  const [topListings, setTopListings] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const stableToast = useCallback((msg, type) => addToast(msg, type), []);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [booksRes, wishlistRes, transactionRes, chatsRes] = await Promise.all([
          bookApi.search({ page: 1, limit: 100 }),
          wishlistApi.get(),
          transactionApi.getMy(),
          chatApi.getConversations(),
        ]);

        const books = booksRes.data.data || [];
        const myListings = books.filter(book => book.seller?._id === user?._id).length;
        const wishlistCount = wishlistRes.data.data?.books?.length || 0;
        const transactionCount = transactionRes.data.data?.length || 0;

        setStats({ myListings, wishlist: wishlistCount, transactions: transactionCount });
        setTopListings(books.slice(0, 3));
        setConversations(chatsRes.data.data || []);
      } catch (error) {
        stableToast(error.response?.data?.message || 'Unable to load dashboard.', 'error');
      }
      setLoading(false);
    };
    loadDashboard();
  }, [user]); // ✅ removed addToast from deps

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-sky-600">Welcome back</p>
              <h1 className="mt-3 text-4xl font-semibold text-slate-950">{user?.name}</h1>
              <p className="mt-3 text-slate-600">{user?.email} • {user?.college} • {user?.branch} • Semester {user?.semester}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/books" className="rounded-2xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800">Browse books</Link>
              <Link to="/add-book" className="rounded-2xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700">Add listing</Link>
              <Link to="/chat" className="rounded-2xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-700">Messages {conversations.length > 0 && `(${conversations.length})`}</Link>
              <button onClick={logout} className="rounded-2xl border border-slate-300 px-5 py-3 text-slate-700 hover:bg-slate-100">Logout</button>
            </div>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">My listings</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.myListings}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Wishlist</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.wishlist}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Transactions</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.transactions}</p>
          </div>
        </section>

        {/* ✅ NEW: Messages / Chat Section */}
        <section className="mt-10 rounded-3xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Messages</h2>
              <p className="mt-2 text-sm text-slate-500">Your conversations with buyers and sellers.</p>
            </div>
            <Link to="/chat" className="text-sm font-semibold text-sky-600 hover:text-sky-700">View all chats</Link>
          </div>
          <div className="mt-6 grid gap-4">
            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-6">Loading messages…</div>
            ) : conversations.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6 text-slate-500">No conversations yet.</div>
            ) : (
              conversations.slice(0, 5).map(conv => {
                const otherUser = conv.buyer?._id === user?._id ? conv.seller : conv.buyer;
                return (
                  <Link
                    key={conv._id}
                    to={`/chat/${conv._id}`}
                    className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 p-5 transition hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-lg">
                        {otherUser?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-950">{otherUser?.name || 'Unknown'}</p>
                        <p className="text-sm text-slate-500">Book: {conv.book?.title || 'Unknown'}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-sky-600 px-4 py-2 text-xs text-white">Open chat</span>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-950">Trust score</h2>
            <p className="mt-4 text-3xl font-bold text-emerald-600">{user?.trustScore || 0}</p>
            <p className="mt-3 text-sm text-slate-500">Your trust rating helps other students trust your listings and offers.</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-950">Quick actions</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Link to="/wishlist" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">View wishlist</Link>
              <Link to="/books" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">Browse books</Link>
              <Link to="/add-book" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">List a new book</Link>
              <Link to="/chat" className="rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100">My messages</Link>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-3xl bg-white p-6 shadow">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Recent approved listings</h2>
              <p className="mt-2 text-sm text-slate-500">Manage your published books and revisit favorites.</p>
            </div>
            <Link to="/books" className="text-sm font-semibold text-sky-600 hover:text-sky-700">Browse all listings</Link>
          </div>
          <div className="mt-6 grid gap-4">
            {loading ? (
              <div className="rounded-3xl bg-slate-50 p-6">Loading listings…</div>
            ) : topListings.length === 0 ? (
              <div className="rounded-3xl bg-slate-50 p-6">No approved listings found.</div>
            ) : (
              topListings.map(book => (
                <Link key={book._id} to={`/books/${book._id}`} className="flex flex-col gap-4 rounded-3xl border border-slate-200 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center">
                  <img src={book.images?.[0]?.url} alt={book.title} className="h-28 w-full rounded-3xl object-cover sm:w-48" />
                  <div>
                    <p className="text-lg font-semibold text-slate-950">{book.title}</p>
                    <p className="mt-2 text-sm text-slate-600">{book.author}</p>
                    <p className="mt-3 text-sm text-slate-500">{book.subject} • {book.semester} semester</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;