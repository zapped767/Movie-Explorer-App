import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useMovieContext } from '../context/MovieContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useMovieContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <MovieIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Movie Explorer
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/">
                Home
              </Button>
              <Button color="inherit" component={Link} to="/favorites">
                <FavoriteIcon sx={{ mr: 1 }} />
                Favorites
              </Button>
              <ThemeToggle />
              <Button color="inherit" onClick={handleLogout}>
                Logout ({user.username})
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/auth">
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;