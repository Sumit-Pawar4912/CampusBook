import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
  if (user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

export default AdminRoute;
