import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Chip, IconButton, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useMovieContext } from '../context/MovieContext';

const MovieCard = ({ movie }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useMovieContext();
  const isFavorite = favorites.some(fav => fav.id === movie.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  };

  return (
    <Card
      component={Link}
      to={`/movie/${movie.id}`}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        textDecoration: 'none',
        '&:hover': {
          transform: 'scale(1.03)',
          transition: 'transform 0.3s',
        },
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/500x750?text=No+Poster'
        }
        alt={movie.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography gutterBottom variant="h6" component="h3">
            {movie.title}
          </Typography>
          <IconButton onClick={handleFavoriteClick} aria-label="add to favorites">
            {isFavorite ? (
              <FavoriteIcon color="error" />
            ) : (
              <FavoriteBorderIcon />
            )}
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Chip
            label={movie.release_date ? movie.release_date.substring(0, 4) : 'N/A'}
            size="small"
            sx={{ mr: 1 }}
          />
          <Chip
            label={`⭐ ${movie.vote_average?.toFixed(1) || 'N/A'}`}
            size="small"
            color="primary"
          />
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {movie.overview || 'No overview available'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard;