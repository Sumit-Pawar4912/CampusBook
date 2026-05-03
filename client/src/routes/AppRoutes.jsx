import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import AdminRoute from '../components/AdminRoute.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import HomePage from '../pages/HomePage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import BooksPage from '../pages/BooksPage.jsx';
import BookDetailsPage from '../pages/BookDetailsPage.jsx';
import AddBookPage from '../pages/AddBookPage.jsx';
import WishlistPage from '../pages/WishlistPage.jsx';
import AdminDashboardPage from '../pages/AdminDashboardPage.jsx';
import ChatPage from '../pages/ChatPage.jsx';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/books" element={<ProtectedRoute><BooksPage /></ProtectedRoute>} />
    <Route path="/books/:id" element={<ProtectedRoute><BookDetailsPage /></ProtectedRoute>} />
    <Route path="/add-book" element={<ProtectedRoute><AddBookPage /></ProtectedRoute>} />
    <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
    <Route path="/chat/:conversationId?" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
    <Route path="*" element={<div className="p-8">Page not found.</div>} />
  </Routes>
);

export default AppRoutes;
