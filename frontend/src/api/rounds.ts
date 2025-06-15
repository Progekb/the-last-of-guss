import axios from 'axios';
axios.defaults.withCredentials = true;
axios.defaults.headers.Authorization = 'Bearer ' + localStorage.getItem('token');

export const getRounds = async () => {
  const response = await axios.get('/rounds');
  return response.data;
};

export const getRound = async (id: string) => {
  const response = await axios.get(`/rounds/${id}`);
  return response.data;
};

export const createRound = async () => {
  const response = await axios.post('/rounds');
  return response.data;
};

export const tapRound = async (roundId: string) => {
  const response = await axios.post(`/rounds/${roundId}/tap`);
  return response.data;
};
