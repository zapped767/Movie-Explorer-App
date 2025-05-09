// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useMovieContext } from '../context/MovieContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useMovieContext();
  return user ? children : <Navigate to="/auth" replace />;
};

export default ProtectedRoute;