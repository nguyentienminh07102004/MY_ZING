import type { RouteObject } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import App from './App';
import MainContent from './components/MainContent';
import Welcome from './components/Welcome';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/welcome',
    element: <Welcome />,
  },
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/main',
        element: <MainContent />,
      },
    ],
  },
]; 