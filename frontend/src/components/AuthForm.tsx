import { useState } from 'react';
import { TextField, Button, Typography, Box } from '@mui/material';

interface AuthFormProps {
  onSubmit: (username: string, password: string) => void;
  error?: string;
}

const AuthForm = ({ onSubmit, error }: AuthFormProps) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    onSubmit(username, password);
  };

  return (
    <div>
      <Box sx={{ my: 5 }}><TextField label="Имя пользователя" value={username} onChange={(e) => setUsername(e.target.value)} /></Box>
      <Box sx={{ my: 5 }}><TextField label="Пароль" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Box>
      <Button onClick={handleSubmit}>Войти</Button>
      {error && <Box sx={{ my: 5 }}><Typography color="error">{error}</Typography></Box>}
    </div>
  );
};

export default AuthForm;
