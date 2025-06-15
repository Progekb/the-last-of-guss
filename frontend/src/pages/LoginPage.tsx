import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Typography, Box } from '@mui/material';
import AuthForm from '../components/AuthForm';

const LoginPage = () => {
  const { loginUser } = useAuth();
  const [error, setError] = useState('');

  const handleSubmit = async (username: string, password: string) => {
    try {
      await loginUser(username, password);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Box width={800} sx={{ m: 10}}>
      <Typography variant="h4">Логин</Typography>
      <AuthForm onSubmit={handleSubmit} error={error}/>
    </Box>
  );
};

export default LoginPage;
