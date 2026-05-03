import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import wishlistApi from '../services/wishlistApi.js';
import { useToast } from '../components/ToastProvider.jsx';
import LoadingSkeleton from '../components/LoadingSkeleton.jsx';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadWishlist = async () => {
    setLoading(true);
    try {
      const response = await wishlistApi.get();
      setWishlist(response.data.data);
    } catch (error) {
      addToast(error.message || 'Unable to load wishlist', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  const removeItem = async bookId => {
    try {
      await wishlistApi.remove(bookId);
      setWishlist(prev => ({ ...prev, books: prev.books.filter(book => book._id !== bookId) }));
      addToast('Removed from wishlist', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to remove item', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-6 rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-950">My Wishlist</h1>
          <p className="mt-2 text-slate-600">Saved campus books you want to revisit.</p>
        </header>

        {loading ? (
          <LoadingSkeleton />
        ) : wishlist?.books?.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center text-slate-600 shadow-lg">Your wishlist is empty. Add some books to save them for later.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {wishlist.books.map(book => (
              <div key={book._id} className="rounded-3xl bg-white p-6 shadow-lg">
                <img src={book.images?.[0]?.url} alt={book.title} className="h-44 w-full rounded-3xl object-cover" />
                <div className="mt-5 space-y-3">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-950">{book.title}</h2>
                    <p className="mt-1 text-slate-600">{book.author}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                    <span className="rounded-full bg-slate-100 px-3 py-1">{book.condition}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1">₹{book.price}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/books/${book._id}`} className="rounded-2xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
                      View listing
                    </Link>
                    <button
                      onClick={() => removeItem(book._id)}
                      className="rounded-2xl border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
