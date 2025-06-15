import { Card, CardContent, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Round } from '../types';

const RoundCard = ({ round }: { round: Round } ) => (
  <Card sx={{ marginBottom: 2 }}>
    <CardContent>
      <Typography variant="h6">
        ID раунда: <Link to={`/${round.id}`}>{round.id}</Link>
      </Typography>
      <Typography>Старт: {round.startTime.toString()}</Typography>
      <Typography>Финиш: {round.endTime.toString()}</Typography>
      <Typography>Статус: {round.status}</Typography>
    </CardContent>
  </Card>
);

export default RoundCard;
