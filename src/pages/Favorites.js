import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Paper, 
  Button,
  CircularProgress,
  
} from '@mui/material';
import MovieCard from '../components/MovieCard';
import { useMovieContext } from '../context/MovieContext';

const Favorites = () => {
  const { favorites, loading } = useMovieContext();
  const navigate = useNavigate();

  const handleBrowseMovies = () => {
    navigate('/');
  };

  // Show loading indicator while favorites are being loaded
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '50vh'
      }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Favorite Movies
      </Typography>
      
      {favorites.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            You don't have any favorite movies yet.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Search for movies and click the heart icon to add them to your favorites.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleBrowseMovies}
            sx={{ mt: 2 }}
          >
            Browse Movies
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {favorites.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard movie={movie} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites;