import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import bookApi from '../services/bookApi.js';
import wishlistApi from '../services/wishlistApi.js';
import transactionApi from '../services/transactionApi.js';
import chatApi from '../services/chatApi.js';
import { useToast } from '../components/ToastProvider.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const BookDetailsPage = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);
  const [reserving, setReserving] = useState(false);
  const [chatting, setChatting] = useState(false);
  const [reservation, setReservation] = useState({ meetupLocation: '', meetupDateTime: '', notes: '' });

  useEffect(() => {
    const loadPage = async () => {
      try {
        // ✅ if not logged in, skip wishlist fetch
        const requests = [bookApi.getById(id)];
        if (user) requests.push(wishlistApi.get());

        const [bookRes, wishlistRes] = await Promise.all(requests);
        setBook(bookRes.data.data);

        if (wishlistRes) {
          const wishlistBooks = wishlistRes.data.data?.books || [];
          setInWishlist(wishlistBooks.some(item => item._id === id));
        }
      } catch (error) {
        addToast(error.response?.data?.message || 'Unable to load book', 'error');
      }
      setLoading(false);
    };
    loadPage();
  }, [id]); // ✅ removed addToast from deps

  const toggleWishlist = async () => {
    if (!user) { navigate('/login'); return; } // ✅ guard
    try {
      if (inWishlist) {
        await wishlistApi.remove(id);
        setInWishlist(false);
        addToast('Removed from wishlist', 'success');
      } else {
        await wishlistApi.add(id);
        setInWishlist(true);
        addToast('Added to wishlist', 'success');
      }
    } catch (error) {
      addToast(error.response?.data?.message || 'Wishlist update failed', 'error');
    }
  };

  const handleReserveSubmit = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; } // ✅ guard
    if (!reservation.meetupLocation || !reservation.meetupDateTime) {
      addToast('Please provide meetup location and date/time', 'error');
      return;
    }
    setReserving(true);
    try {
      await transactionApi.request(id, {
        meetupLocation: reservation.meetupLocation,
        meetupDateTime: reservation.meetupDateTime,
        notes: reservation.notes,
      });
      addToast('Reservation requested successfully', 'success');
      setReserveOpen(false);
      navigate('/dashboard');
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to reserve this book', 'error');
    }
    setReserving(false);
  };

  const startChat = async () => {
    if (!user) { navigate('/login'); return; } // ✅ guard for unauthenticated user

    // ✅ fix: compare as strings to avoid ObjectId vs string mismatch
    const sellerId = book.seller?._id?.toString();
    const userId = user.id?.toString() || user._id?.toString();

    if (!sellerId) {
      addToast('Seller information is missing', 'error');
      return;
    }

    if (userId === sellerId) {
      addToast('You cannot chat with yourself', 'error');
      return;
    }

    setChatting(true);
    try {
      const response = await chatApi.createConversation(id, sellerId);
      navigate(`/chat/${response.data.data._id}`);
    } catch (error) {
      addToast(error.response?.data?.message || 'Unable to start chat', 'error');
    }
    setChatting(false);
  };

  if (loading) return <div className="min-h-screen bg-slate-50 p-6">Loading…</div>;
  if (!book) return <div className="min-h-screen bg-slate-50 p-6">Book not found.</div>;

  // ✅ safe seller ID comparison for rendering the chat button
  const sellerId = book.seller?._id?.toString();
  const userId = user?.id?.toString() || user?._id?.toString();
  const isOwnBook = userId === sellerId;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <Link to="/books" className="text-sky-600 hover:underline">← Back to listings</Link>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <div className="rounded-3xl overflow-hidden shadow-xl">
                  <img src={book.images?.[0]?.url} alt={book.title} className="h-full w-full object-cover" />
                </div>
                {book.images?.length > 1 && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {book.images.slice(0, 3).map((image, idx) => (
                      <img key={idx} src={image.url} alt={`${book.title} ${idx}`} className="h-24 w-full rounded-2xl object-cover" />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Book details</p>
                    <h1 className="mt-3 text-4xl font-semibold text-slate-950">{book.title}</h1>
                    <p className="mt-3 text-xl text-slate-600">{book.author}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Condition</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{book.condition}</p>
                    </div>
                    <div className="rounded-3xl bg-slate-50 p-5">
                      <p className="text-sm text-slate-500">Type</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{book.type}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-5">
                    <p className="text-sm text-slate-500">Subject</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{book.subject}</p>
                    <p className="mt-2 text-sm text-slate-600">Semester {book.semester}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 rounded-3xl bg-slate-50 p-6">
              <p className="text-sm text-slate-500">Description</p>
              <p className="mt-3 text-slate-700">A trusted listing from your college community. Perfect for students seeking fast campus pickup.</p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Price</p>
                  <p className="mt-3 text-4xl font-bold text-slate-950">₹{book.price}</p>
                </div>
                <button
                  onClick={toggleWishlist}
                  className={`rounded-3xl px-5 py-3 text-sm font-semibold transition ${inWishlist ? 'bg-rose-500 text-white hover:bg-rose-600' : 'bg-slate-900 text-white hover:bg-slate-800'}`}
                >
                  {inWishlist ? 'Remove Wishlist' : 'Add to Wishlist'}
                </button>
              </div>
              <div className="mt-6 space-y-3 rounded-3xl bg-slate-50 p-5">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Seller</p>
                <p className="mt-2 text-lg font-semibold text-slate-950">{book.seller?.name}</p>
                <p className="text-slate-500">College: {book.seller?.college}</p>
                <p className="text-slate-500">Trust score: {book.seller?.trustScore ?? book.seller?.rating ?? 'N/A'}</p>
              </div>

              {/* ✅ show chat button only if logged in and not own book */}
              {!isOwnBook && (
                <button
                  onClick={startChat}
                  disabled={chatting}
                  className="mt-4 w-full rounded-3xl bg-sky-600 px-5 py-3 text-white hover:bg-sky-700 disabled:opacity-50"
                >
                  {chatting ? 'Starting chat…' : user ? 'Chat with seller' : 'Login to chat'}
                </button>
              )}
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-lg">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Reserve on campus</p>
              <p className="mt-3 text-slate-600">Send a request to the seller and arrange a meetup on campus.</p>
              <button
                onClick={() => setReserveOpen(prev => !prev)}
                className="mt-6 w-full rounded-3xl bg-emerald-600 px-5 py-3 text-white hover:bg-emerald-500"
              >
                {reserveOpen ? 'Hide reservation' : 'Reserve this book'}
              </button>
              {reserveOpen && (
                <form onSubmit={handleReserveSubmit} className="mt-6 space-y-4">
                  <input
                    value={reservation.meetupLocation}
                    onChange={e => setReservation(prev => ({ ...prev, meetupLocation: e.target.value }))}
                    placeholder="Meetup location"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                    required
                  />
                  <input
                    type="datetime-local"
                    value={reservation.meetupDateTime}
                    onChange={e => setReservation(prev => ({ ...prev, meetupDateTime: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                    required
                  />
                  <textarea
                    value={reservation.notes}
                    onChange={e => setReservation(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes for the seller"
                    className="w-full rounded-2xl border border-slate-300 px-4 py-3"
                    rows="4"
                  />
                  <button type="submit" disabled={reserving} className="w-full rounded-3xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800">
                    {reserving ? 'Sending request…' : 'Send reservation request'}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;