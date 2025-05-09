import React, { useContext } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MovieContext from '../context/MovieContext';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(MovieContext);

  return (
    <Tooltip title={darkMode ? 'Light mode' : 'Dark mode'}>
      <IconButton 
        color="inherit" 
        onClick={toggleDarkMode}
        aria-label="toggle theme"
      >
        {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;