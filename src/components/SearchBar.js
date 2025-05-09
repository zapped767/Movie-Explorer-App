import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMovieContext } from '../context/MovieContext';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { searchMovies } = useMovieContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    searchMovies(query);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </form>
  );
};

export default SearchBar;