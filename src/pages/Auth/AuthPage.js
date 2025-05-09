import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Tabs, Tab, Paper } from '@mui/material';
import Login from './Login';
import Signup from './Signup';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // Set tab based on URL query parameter
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    setTabValue(tab === '1' ? 1 : 0);
  }, [location.search]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    navigate(`/auth?tab=${newValue}`);
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
        <Box sx={{ pt: 3 }}>
          {tabValue === 0 ? <Login /> : <Signup />}
        </Box>
      </Paper>
    </Container>
  );
};

export default AuthPage;