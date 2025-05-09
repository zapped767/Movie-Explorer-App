import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';

// Create Movie Context
const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  // State management for movies, UI, and user
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState(null);

  // Initialize state from localStorage on first render
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('movieExplorerUser');
      const storedFavorites = localStorage.getItem('movieExplorerFavorites');
      const storedTheme = localStorage.getItem('movieExplorerDarkMode');

      // Hydrate state from localStorage if values exist
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedFavorites) setFavorites(JSON.parse(storedFavorites));
      if (storedTheme) setDarkMode(JSON.parse(storedTheme));
      
      // Apply dark mode to body immediately
      document.body.style.backgroundColor = storedTheme === 'true' ? '#121212' : '#ffffff';
    } catch (err) {
      console.error('Failed to parse localStorage data:', err);
      // Clear corrupted data
      localStorage.removeItem('movieExplorerUser');
    }
  }, []);

  // Persist favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem('movieExplorerFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Apply dark mode styles and persist preference
  useEffect(() => {
    localStorage.setItem('movieExplorerDarkMode', JSON.stringify(darkMode));
    document.body.style.backgroundColor = darkMode ? '#121212' : '#ffffff';
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  // Centralized API request handler
  const apiRequest = useCallback(async (endpoint, params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}${endpoint}`, {
        params: {
          ...params,
          api_key: process.env.REACT_APP_TMDB_API_KEY,
        },
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_TMDB_ACCESS_TOKEN}`,
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.status_message || 'API request failed';
      setError(errorMessage);
      throw new Error(errorMessage); // Re-throw for component-level handling
    } finally {
      setLoading(false);
    }
  }, []);

  // Authentication functions with enhanced error handling
  const login = useCallback(async (username, password) => {
    try {
      // In production: Replace with actual authentication API call
      // const response = await axios.post('/api/auth/login', { username, password });
      
      const userData = { 
        username,
        id: Date.now().toString(), // Mock user ID
        token: 'mock-auth-token', // Mock session token
        lastLogin: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('movieExplorerUser', JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error('Login failed:', err);
      setError('Invalid credentials. Please try again.');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('movieExplorerUser');
    // Optional: Add API call to invalidate server session
  }, []);

  const register = useCallback(async (username, password) => {
    try {
      // In production: Replace with actual registration API call
      // const response = await axios.post('/api/auth/register', { username, password });
      
      const userData = { 
        username,
        id: Date.now().toString(),
        token: 'mock-registration-token',
        joinedDate: new Date().toISOString()
      };
      
      setUser(userData);
      localStorage.setItem('movieExplorerUser', JSON.stringify(userData));
      return true;
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    }
  }, []);

  // Movie data functions
  const searchMovies = useCallback(async (query) => {
    if (!query?.trim()) {
      setMovies([]);
      return;
    }
    try {
      const data = await apiRequest('/search/movie', { query });
      setMovies(data?.results || []);
    } catch (err) {
      setMovies([]);
      // Error already set by apiRequest
    }
  }, [apiRequest]);

  const fetchTrending = useCallback(async () => {
    try {
      const data = await apiRequest('/trending/movie/week');
      setTrending(data?.results || []);
    } catch (err) {
      setTrending([]);
    }
  }, [apiRequest]);

  const getMovieDetails = useCallback(async (id) => {
    return await apiRequest(`/movie/${id}`, { 
      append_to_response: 'videos,credits' 
    });
  }, [apiRequest]);

  // Favorite management with robust persistence
const updateFavorites = useCallback((newFavorites) => {
  try {
    localStorage.setItem('movieExplorerFavorites', JSON.stringify(newFavorites));
    return newFavorites;
  } catch (err) {
    console.error('Failed to save favorites:', err);
    // Fallback 1: Try sessionStorage
    try {
      sessionStorage.setItem('favoritesBackup', JSON.stringify(newFavorites));
    } catch (e) {
      console.error('Failed backup save:', e);
    }
    // Fallback 2: Return previous state
    return favorites;
  }
}, [favorites]);

const addToFavorites = useCallback((movie) => {
  if (!movie?.id) return; // Validate movie object
  
  setFavorites(prev => {
    // Prevent duplicates
    if (prev.some(fav => fav.id === movie.id)) return prev;
    
    const newFavorites = [...prev, movie];
    return updateFavorites(newFavorites);
  });
}, [updateFavorites]);

const removeFromFavorites = useCallback((id) => {
  setFavorites(prev => {
    const newFavorites = prev.filter(movie => movie.id !== id);
    return updateFavorites(newFavorites);
  });
}, [updateFavorites]);

  // Theme management
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Context value exposed to components
  const contextValue = {
    movies,
    trending,
    favorites,
    loading,
    error,
    darkMode,
    user,
    searchMovies,
    fetchTrending,
    getMovieDetails,
    addToFavorites,
    removeFromFavorites,
    toggleDarkMode,
    login,
    logout,
    register,
    isAuthenticated: !!user // Helper boolean
  };

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook for easy context consumption
export const useMovieContext = () => {
  const context = React.useContext(MovieContext);
  if (!context) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};

export default MovieContext;