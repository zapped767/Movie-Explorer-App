import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { MovieProvider, useMovieContext } from './context/MovieContext';
import AuthPage from './pages/Auth/AuthPage';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import MoviePage from './pages/MoviePage';





// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useMovieContext();
  return user ? children : <Navigate to="/auth" replace />;
};

// Main App Content
const AppContent = () => {
  const { darkMode } = useMovieContext();
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: { main: '#3f51b5' },
      secondary: { main: '#f50057' },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        } />
        <Route path="/movie/:id" element={
          <ProtectedRoute>
            <MoviePage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    </ThemeProvider>
  );
};

function App() {
  return (
    <MovieProvider>
      <Router>
        <AppContent />
      </Router>
    </MovieProvider>
  );
}

export default App;