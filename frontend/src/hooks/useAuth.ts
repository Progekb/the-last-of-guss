import { login } from '../api/auth';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from '../store/userSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const loginUser = async (username: string, password: string) => {
    try {
      const data = await login(username, password);
      dispatch(setUser({
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
      }));
      localStorage.setItem('token', data.access_token);
      window.location.href = '/'
    } catch (error) {
      throw new Error('Неверные логин или пароль');
    }
  };

  const logout = () => {
    dispatch(clearUser())
    localStorage.removeItem('token');
    window.location.href = '/login'
  };

  return { loginUser, logout };
};
