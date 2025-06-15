import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RoundListPage from './pages/RoundListPage';
import RoundPage from './pages/RoundPage';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { clearUser, setUser } from './store/userSlice';
import { userInfo } from './api/auth';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await userInfo();
          if (!user) {
            if (window.location.pathname !== '/login') window.location.href = '/login';
          }
          dispatch(setUser({ ...user, token }));
        } catch (error) {
          console.error('Ошибка получения пользователя:', error);
          localStorage.removeItem('token');
          dispatch(clearUser());
          if (window.location.pathname !== '/login') window.location.href = '/login';
        }
      } else {
        if (window.location.pathname !== '/login') window.location.href = '/login';
      }
    };

    initUser();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoundListPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/:id" element={<RoundPage/>}/>
      </Routes>
    </Router>
  )
};

export default App;
