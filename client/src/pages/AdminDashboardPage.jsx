import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/ToastProvider.jsx';
import adminApi from '../services/adminApi.js';

const AdminDashboardPage = () => {
  const { addToast } = useToast();
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = async () => {
      setLoading(true);
      try {
        const [statsRes, usersRes, pendingRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers(),
          adminApi.getPendingListings(),
        ]);
        setStats(statsRes.data.data);
        setUsers(usersRes.data.data || []);
        setPending(pendingRes.data.data || []);
      } catch (error) {
        addToast(error.message || 'Unable to load admin dashboard', 'error');
      }
      setLoading(false);
    };
    loadAdmin();
  }, [addToast]);

  const updateUser = (id, updater) => setUsers(prev => prev.map(user => (user._id === id ? updater(user) : user)));
  const removePending = id => setPending(prev => prev.filter(item => item._id !== id));

  const handleVerify = async id => {
    try {
      await adminApi.verifyUser(id);
      updateUser(id, user => ({ ...user, isVerified: true }));
      addToast('User verified successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to verify user', 'error');
    }
  };

  const handleBan = async id => {
    try {
      await adminApi.banUser(id);
      updateUser(id, user => ({ ...user, isBanned: true }));
      addToast('User banned successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to ban user', 'error');
    }
  };

  const handleUnban = async id => {
    try {
      await adminApi.unbanUser(id);
      updateUser(id, user => ({ ...user, isBanned: false }));
      addToast('User unbanned successfully', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to unban user', 'error');
    }
  };

  const handleApprove = async id => {
    try {
      await adminApi.approveListing(id);
      removePending(id);
      addToast('Listing approved', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to approve listing', 'error');
    }
  };

  const handleReject = async id => {
    try {
      await adminApi.rejectListing(id);
      removePending(id);
      addToast('Listing rejected', 'success');
    } catch (error) {
      addToast(error.message || 'Unable to reject listing', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="mx-auto max-w-7xl p-6">
        <header className="mb-8 rounded-3xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-semibold text-slate-950">Admin Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage users and review pending book listings across the community.</p>
        </header>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total users</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.totalUsers ?? 0}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Approved listings</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.approvedListings ?? 0}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Pending listings</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.pendingListings ?? 0}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow">
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Transactions</p>
            <p className="mt-4 text-4xl font-semibold text-slate-950">{loading ? '…' : stats.totalTransactions ?? 0}</p>
          </div>
        </div>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-950">Pending listings</h2>
            <div className="mt-6 space-y-4">
              {pending.length === 0 ? (
                <div className="rounded-3xl bg-slate-50 p-6 text-slate-600">No pending listings available.</div>
              ) : (
                pending.map(item => (
                  <div key={item._id} className="rounded-3xl border border-slate-200 p-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-lg font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-1 text-sm text-slate-600">{item.author} • {item.subject}</p>
                        <p className="mt-2 text-sm text-slate-500">Seller: {item.seller?.name || item.owner?.name} • {item.seller?.college || item.owner?.college}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleApprove(item._id)} className="rounded-2xl bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">Approve</button>
                        <button onClick={() => handleReject(item._id)} className="rounded-2xl bg-rose-600 px-4 py-2 text-white hover:bg-rose-700">Reject</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow">
            <h2 className="text-xl font-semibold text-slate-950">User management</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {users.map(user => (
                    <tr key={user._id}>
                      <td className="px-4 py-4 font-medium text-slate-950">{user.name}</td>
                      <td className="px-4 py-4 text-slate-600">{user.college}</td>
                      <td className="px-4 py-4 text-slate-600">{user.isBanned ? 'Banned' : user.isVerified ? 'Verified' : 'Pending'}</td>
                      <td className="px-4 py-4 space-x-2">
                        {!user.isVerified && (
                          <button onClick={() => handleVerify(user._id)} className="rounded-2xl bg-sky-600 px-3 py-2 text-white hover:bg-sky-700">Verify</button>
                        )}
                        {user.isBanned ? (
                          <button onClick={() => handleUnban(user._id)} className="rounded-2xl bg-emerald-600 px-3 py-2 text-white hover:bg-emerald-700">Unban</button>
                        ) : (
                          <button onClick={() => handleBan(user._id)} className="rounded-2xl bg-rose-600 px-3 py-2 text-white hover:bg-rose-700">Ban</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
