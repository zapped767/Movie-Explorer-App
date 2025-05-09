import React, { useContext, useEffect } from 'react';
import { Grid, Typography, Box, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import MovieContext from '../context/MovieContext';

const TrendingMovies = () => {
  const { trending, loading, error } = useContext(MovieContext);

  if (loading && trending.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ my: 2 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{ my: 4 }}>
      <Typography variant="h5" gutterBottom>
        Trending This Week
      </Typography>
      <Grid container spacing={4}>
        {trending.slice(0, 8).map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingMovies;