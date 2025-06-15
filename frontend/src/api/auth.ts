import axios from 'axios';
axios.defaults.withCredentials = true;

const API_URL = 'http://localhost:3000/auth';

export const login = async (username: string, password: string) => {
  const response = await axios.post(`${API_URL}/login`, { username, password });
  return response.data;
};

export const userInfo = async () => {
  const response = await axios.get(`${API_URL}/userInfo`);
  return response.data;
};
