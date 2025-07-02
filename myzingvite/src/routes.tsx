import type { RouteObject } from 'react-router-dom';
import App from './App';
import MainContent from './components/MainContent';
import Home from './pages/Home';
import Login from './pages/Login';
import PlaylistSongs from './pages/PlaylistSongs';
import Uploaded from './pages/Uploaded';
import Profile from './pages/Profile';
import SongDetail from './pages/SongDetail';
import Register from './pages/Register';
import AdminUsers from './pages/AdminUsers';
import AdminTags from './pages/AdminTags';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />
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
      {
        path: '/playlist/:id',
        element: <PlaylistSongs />,
      },
      {
        path: '/uploaded',
        element: <Uploaded />,
      },
      {
        path: '/profile',
        element: <Profile />,
      },
      {
        path: '/song/:id',
        element: <SongDetail />,
      },
      {
        path: '/admin/users',
        element: <AdminUsers />,
      },
      {
        path: '/admin/tags',
        element: <AdminTags />,
      },
    ],
  },
]; 