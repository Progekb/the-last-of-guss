export interface User {
  id: string;
  username: string;
  password?: string;
  role: string;
}
interface BestScore {
  count: number
  userId: string
  username: string
}
export interface Round {
  id: string,
  startTime: Date,
  endTime: Date,
  status: string
  taps: []
  myScore: number
  allScore: number
  bestScore: BestScore
}
