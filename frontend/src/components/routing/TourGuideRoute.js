import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const TourGuideRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated || (user?.role !== 'tourGuide' && user?.role !== 'admin')) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default TourGuideRoute;
