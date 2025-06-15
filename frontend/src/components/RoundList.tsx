import { useEffect, useState } from 'react';
import RoundCard from './RoundCard';
import { createRound, getRounds } from '../api/rounds';
import { Round, User } from '../types';
import { Button, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const RoundList = () => {
  const [rounds, setRounds] = useState<Round[]>([]);
  const user: User | null = useSelector((state: RootState) => state.user.currentUser);

  useEffect(() => {
    (async () => {
      await getRoundStart();
    })()
  }, []);

  const getRoundStart = async () => {
    const rounds = await getRounds();
    setRounds(rounds);
  }

  const handleSubmit = async () => {
    await createRound();
    await getRoundStart();
  }

  if (!rounds) return <Typography>Загрузка раундов...</Typography>;

  return (
    <div>
      {user?.role === 'admin' && (
        <Button onClick={handleSubmit}>
          Создать раунд
        </Button>
      )}
      {rounds.map((round: Round) => (
        <RoundCard key={round.id} round={round} />
      ))}
    </div>
  );
};

export default RoundList;
