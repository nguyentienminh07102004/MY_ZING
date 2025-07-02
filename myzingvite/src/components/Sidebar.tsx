import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AlbumIcon from '@mui/icons-material/Album';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1] as string));
  } catch {
    return null;
  }
}

const mainMenuItems = [
  { text: 'Khám Phá', icon: <HomeIcon />, path: '/' },
  { text: 'Thư Viện', icon: <LibraryMusicIcon />, path: '/main' },
  { text: 'Đã Tải Lên', icon: <CloudUploadIcon />, path: '/uploaded' },
  { text: 'Nhạc Yêu Thích', icon: <FavoriteIcon />, path: '/favourite' },
  { text: 'Playlist Của Tôi', icon: <PlaylistPlayIcon />, path: '/my-playlist' },
  { text: 'Top 100', icon: <AlbumIcon />, path: '/top100' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  let isAdmin = false;
  if (token) {
    const payload = parseJwt(token);
    if (payload && (payload.role === 'ADMIN' || payload.scope === 'ADMIN')) {
      isAdmin = true;
    }
  }

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 70,
        left: 0,
        height: 'calc(100vh - 70px)',
        zIndex: (theme) => theme.zIndex.drawer,
      }}
    >
      <Box sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate('/')}>
        <img src="/zing-logo.png" alt="Zing MP3" style={{ height: 40 }} />
      </Box>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}>
        <List component="nav">
          {mainMenuItems.map((item) => (
            <ListItem
              key={item.text}
              component="div"
              onClick={() => navigate(item.path)}
              sx={{
                borderRadius: 1,
                mx: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'text.primary', minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
          {isAdmin && (
            <>
              <ListItem
                key="Quản lý user"
                component="div"
                onClick={() => navigate('/admin/users')}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 40 }}>
                  <AdminPanelSettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Quản lý user" />
              </ListItem>
              <ListItem
                key="Quản lý tag"
                component="div"
                onClick={() => navigate('/admin/tags')}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'text.primary', minWidth: 40 }}>
                  <MusicNoteIcon />
                </ListItemIcon>
                <ListItemText primary="Quản lý tag" />
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar; 