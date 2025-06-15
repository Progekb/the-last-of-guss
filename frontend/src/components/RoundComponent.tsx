import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRound, tapRound } from '../api/rounds';
import { Box, Button, Typography } from '@mui/material';
import { Round, User } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAuth } from '../hooks/useAuth';

enum RoundStatus {
  COOLDOWN = 'Cooldown',
  ACTIVE = 'Активен',
  ENDED = 'Завершен',
}

const RoundComponent = () => {
  const { id } = useParams();
  const [round, setRound] = useState<Round | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const intervalCooldownId = useRef<NodeJS.Timeout | null>(null);
  const intervalRoundId = useRef<NodeJS.Timeout | null>(null);
  const user: User | null = useSelector((state: RootState) => state.user.currentUser);
  const { logout } = useAuth();

  const setTime = async (tm: Date) => {
    const time = Math.floor((new Date(tm).getTime() - new Date().getTime()) / 1000) ;
    setTimer(time);
    if (time !== null && time <= 0) {
      await getRoundApi();
      stopInterval();
    }
  }

  const secondsToTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    const pad = (num: number) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}:${pad(remainingSeconds)}`;
  }

  const getRoundApi = async () => {
    const roundRes = await getRound(id!);
    setRound(roundRes);
  }

  const stopInterval = () => {
    if (intervalCooldownId.current) {
      clearInterval(intervalCooldownId.current);
      intervalCooldownId.current = null;
    }
    if (intervalRoundId.current) {
      clearInterval(intervalRoundId.current);
      intervalRoundId.current = null;
    }
  }

  useEffect(() => {
    (async () => {
      await getRoundApi();
    })()
    return () => stopInterval();
  }, []);

  useEffect(() => {
    (async () => {
      if (round?.status === RoundStatus.COOLDOWN && !intervalCooldownId.current) {
        stopInterval();
        await setTime(round.startTime);
        intervalCooldownId.current = setInterval(async () => {
          await setTime(round.startTime);
        }, 1000);
      }
      if (round?.status === RoundStatus.ACTIVE && !intervalRoundId.current) {
        stopInterval();
        await setTime(round.endTime);
        intervalRoundId.current = setInterval(async () => {
          await setTime(round.endTime);
        }, 1000);
      }
    })()
  }, [round]);

  const handleTap = async () => {
    if (round?.status === RoundStatus.ACTIVE) {
      const { score } = await tapRound(id!);
      setRound({ ...round, myScore: score });
    }
  };

  if (!round) return <Typography>Загрузка раунда...</Typography>;

  return (
    <Typography align={'center'}>
      <Typography align={'right'}>
        {user?.username}
        <Button onClick={logout}>
          Выход
        </Button>
      </Typography>
      <Typography variant="h6">Раунд {round.status}</Typography>
      <Box onClick={handleTap}>
      <pre style={{cursor: round.status === RoundStatus.ACTIVE ? 'pointer' : 'default'}}>{`
      |            ░░░░░░░░░░░░░░░            │
      │          ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░           │
      │        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
      │        ░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░         │
      │      ░░░░▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       │
      │    ░░▒▒▒▒░░░░▓▓▓▓▓▓▓▓▓▓▓▓░░░░▒▒▒▒░░   │
      │    ░░▒▒▒▒▒▒▒▒░░░░░░░░░░░░▒▒▒▒▒▒▒▒░░   │
      │    ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░   │
      │      ░░▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░░     │
      │        ░░░░░░░░░░░░░░░░░░░░░░░░░░     │
      `}</pre>
      </Box>
      <Typography>{round.status}</Typography>
      {round.status === RoundStatus.COOLDOWN && timer && timer > 0 && (
        <Typography> до начала раунда {secondsToTime(timer)}</Typography>
      )}
      {round.status === RoundStatus.ACTIVE && timer && timer > 0 && (
        <Typography> До конца осталось: {secondsToTime(timer)}</Typography>
      )}
      {round.status === RoundStatus.ACTIVE && (
        <Typography> Мои очки - {round?.myScore}</Typography>
      )}
      {round.status === RoundStatus.ENDED && (
        <div>
          <Typography> Всего - {round?.allScore}</Typography>
          <Typography> Победитель - {round?.bestScore.username} - {round?.bestScore.count}</Typography>
          <Typography> Мои очки - {round?.myScore}</Typography>
        </div>
      )}
    </Typography>
  );
};

export default RoundComponent;
