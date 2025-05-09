import React, { useState, useEffect,useContext} from 'react';
import Grid from '@mui/material/Unstable_Grid2';

import {
  Box,
  Typography,
  Chip,
  Divider,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Link,
  Rating
} from '@mui/material';
import { Movie as MovieIcon, Favorite, FavoriteBorder } from '@mui/icons-material';
import axios from 'axios';
import { useMovieContext } from '../context/MovieContext';

const MovieDetails = ({ movieId }) => {
  const {
    addToFavorites,
    removeFromFavorites,
    favorites,
    darkMode,
    API_KEY
  } = useContext(MovieContext);
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [trailerKey, setTrailerKey] = useState('');

  const isFavorite = favorites.some(fav => fav.id === movieId);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=videos,credits`
        );
        setMovie(response.data);
        
        // Find trailer
        const trailer = response.data.videos?.results?.find(
          video => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) setTrailerKey(trailer.key);
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId, API_KEY]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(movieId);
    } else {
      addToFavorites({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        overview: movie.overview,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
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

  if (!movie) {
    return (
      <Alert severity="warning" sx={{ my: 2 }}>
        Movie not found
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Poster */}
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/no-poster.jpg'
            }
            alt={movie.title}
            sx={{ width: '100%', borderRadius: 2 }}
          />
          
          <Box mt={2} display="flex" justifyContent="center">
            <Button
              variant={isFavorite ? 'contained' : 'outlined'}
              color="secondary"
              startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
              onClick={handleFavoriteClick}
              fullWidth
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </Button>
          </Box>
          
          <Box mt={2}>
            <Typography variant="h6">Details</Typography>
            <Divider sx={{ my: 1 }} />
            <Typography><strong>Status:</strong> {movie.status}</Typography>
            <Typography><strong>Release Date:</strong> {movie.release_date}</Typography>
            <Typography><strong>Runtime:</strong> {movie.runtime} mins</Typography>
            <Typography><strong>Budget:</strong> ${movie.budget?.toLocaleString() || 'N/A'}</Typography>
            <Typography><strong>Revenue:</strong> ${movie.revenue?.toLocaleString() || 'N/A'}</Typography>
          </Box>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            {movie.title} 
            {movie.release_date && (
              <Typography component="span" variant="h5" color="text.secondary" ml={2}>
                ({movie.release_date.substring(0, 4)})
              </Typography>
            )}
          </Typography>
          
          <Box display="flex" alignItems="center" mb={2}>
            <Rating
              value={movie.vote_average / 2}
              precision={0.1}
              readOnly
              size="large"
            />
            <Typography ml={1} variant="body1">
              {movie.vote_average?.toFixed(1)}/10 ({movie.vote_count} votes)
            </Typography>
          </Box>
          
          <Box mb={2}>
            {movie.genres?.map(genre => (
              <Chip 
                key={genre.id} 
                label={genre.name} 
                sx={{ mr: 1, mb: 1 }} 
              />
            ))}
          </Box>
          
          <Typography variant="h5" gutterBottom>Overview</Typography>
          <Typography paragraph>{movie.overview || 'No overview available.'}</Typography>
          
          {trailerKey && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Trailer</Typography>
              <Box sx={{ mt: 2, mb: 3, position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  title={`${movie.title} Trailer`}
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: '8px'
                  }}
                />
              </Box>
            </>
          )}
          
          {movie.credits?.cast?.length > 0 && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Top Cast</Typography>
              <List sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 2 }}>
                {movie.credits.cast.slice(0, 10).map(actor => (
                  <Paper key={actor.id} elevation={2} sx={{ minWidth: 150 }}>
                    <ListItem sx={{ flexDirection: 'column' }}>
                      <Avatar
                        src={
                          actor.profile_path
                            ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                            : '/default-avatar.jpg'
                        }
                        sx={{ width: 80, height: 80, mb: 1 }}
                      />
                      <ListItemText
                        primary={actor.name}
                        secondary={`as ${actor.character}`}
                        primaryTypographyProps={{ align: 'center', fontWeight: 'bold' }}
                        secondaryTypographyProps={{ align: 'center' }}
                      />
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </>
          )}
          
          {movie.homepage && (
            <Box mt={3}>
              <Typography variant="h5" gutterBottom>Official Links</Typography>
              <Link href={movie.homepage} target="_blank" rel="noopener">
                Visit Official Website
              </Link>
            </Box>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MovieDetails;