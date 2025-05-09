import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  Avatar,
} from '@mui/material';
import MovieContext from '../context/MovieContext';
import YouTube from 'react-youtube';

const MoviePage = () => {
  const { id } = useParams();
  const { getMovieDetails, addToFavorites, removeFromFavorites, favorites } = useContext(MovieContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isFavorite = favorites.some(fav => fav.id === Number(id));

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, getMovieDetails]);

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(Number(id));
    } else {
      addToFavorites(movie);
    }
  };

  const getTrailerId = () => {
    if (!movie || !movie.videos || !movie.videos.results) return null;
    const trailer = movie.videos.results.find(vid => vid.type === 'Trailer');
    return trailer ? trailer.key : null;
  };

  const trailerId = getTrailerId();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!movie) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="warning">Movie not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box
              component="img"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : 'https://via.placeholder.com/500x750?text=No+Poster'
              }
              alt={movie.title}
              sx={{ width: '100%', borderRadius: 1 }}
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Button
                variant={isFavorite ? 'outlined' : 'contained'}
                color="primary"
                startIcon={isFavorite ? <span>✓</span> : <span>+</span>}
                onClick={handleFavoriteClick}
              >
                {isFavorite ? 'In Favorites' : 'Add to Favorites'}
              </Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>
            {movie.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label={`⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}`} />
            <Chip label={`${movie.runtime} mins`} />
            <Chip label={movie.release_date} />
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {movie.genres?.map(genre => (
              <Chip key={genre.id} label={genre.name} />
            ))}
          </Box>
          <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
            Overview
          </Typography>
          <Typography paragraph>{movie.overview}</Typography>
          
          {trailerId && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Trailer
              </Typography>
              <Box sx={{ mt: 2, mb: 4 }}>
                <YouTube videoId={trailerId} opts={{ width: '100%' }} />
              </Box>
            </>
          )}
          
          {movie.credits?.cast?.length > 0 && (
            <>
              <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
                Cast
              </Typography>
              <List sx={{ display: 'flex', overflowX: 'auto', gap: 2, py: 2 }}>
                {movie.credits.cast.slice(0, 10).map(actor => (
                  <Paper key={actor.id} elevation={2} sx={{ minWidth: 150 }}>
                    <ListItem>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                          secondary={actor.character}
                          primaryTypographyProps={{ align: 'center' }}
                          secondaryTypographyProps={{ align: 'center' }}
                        />
                      </Box>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default MoviePage;