import AlbumIcon from '@mui/icons-material/Album';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import HomeIcon from '@mui/icons-material/Home';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import StarIcon from '@mui/icons-material/Star';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Box, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

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
];

const libraryItems = [
  { text: 'BXH Nhạc Mới', icon: <StarIcon /> },
  { text: 'Chủ Đề & Thể Loại', icon: <MusicNoteIcon /> },
  { text: 'Top 100', icon: <AlbumIcon /> },
];

const playlistItems = [
  { text: 'Nhạc Yêu Thích', icon: <FavoriteIcon /> },
  { text: 'Nghe Gần Đây', icon: <HistoryIcon /> },
  { text: 'Playlist Của Tôi', icon: <PlaylistPlayIcon /> },
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
        top: 70, // Header height
        left: 0,
        height: 'calc(100vh - 70px)', // viewport height - header only
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
          )}
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          THƯ VIỆN
        </Typography>
        <List component="nav">
          {libraryItems.map((item) => (
            <ListItem
              key={item.text}
              component="div"
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
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          PLAYLIST
        </Typography>
        <List component="nav">
          {playlistItems.map((item) => (
            <ListItem
              key={item.text}
              component="div"
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
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar; 