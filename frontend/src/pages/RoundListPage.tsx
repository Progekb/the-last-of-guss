import { Box, Button, Typography } from '@mui/material';
import RoundList from '../components/RoundList';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { User } from '../types';
import { useAuth } from '../hooks/useAuth';

const RoundListPage = () => {
  const user: User | null = useSelector((state: RootState) => state.user.currentUser);
  const { logout } = useAuth();

  return (
    <Box width={800} sx={{ m: 10}}>
      <Typography align={'right'}>
        {user?.username}
        <Button onClick={logout}>
          Выход
        </Button>
      </Typography>
      <Typography variant="h6">Список раундов</Typography>
      <RoundList />
    </Box>
  );
};

export default RoundListPage;
