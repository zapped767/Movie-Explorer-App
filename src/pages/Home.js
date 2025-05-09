import React, { useEffect } from 'react';
import { Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import MovieCard from '../components/MovieCard';
import SearchBar from '../components/SearchBar';
import { useMovieContext } from '../context/MovieContext';

const Home = () => {
  const { movies, trending, loading, error, fetchTrending } = useMovieContext();

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  if (loading && !movies.length && !trending.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <SearchBar />
      
      {/* Show search results if any */}
      {movies.length > 0 ? (
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Search Results
          </Typography>
          <Grid container spacing={4}>
            {movies.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        /* Show trending movies when no search results */
        <>
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Trending This Week
          </Typography>
          <Grid container spacing={4}>
            {trending.map((movie) => (
              <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                <MovieCard movie={movie} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default Home;