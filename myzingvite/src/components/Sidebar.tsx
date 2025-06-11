import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import StarIcon from '@mui/icons-material/Star';
import HistoryIcon from '@mui/icons-material/History';
import AlbumIcon from '@mui/icons-material/Album';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';

const mainMenuItems = [
  { text: 'Khám Phá', icon: <HomeIcon /> },
  { text: '#zingchart', icon: <ExploreIcon /> },
  { text: 'Thư Viện', icon: <LibraryMusicIcon /> },
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
      <Box sx={{ p: 2 }}>
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
          THƯ VIỆN
        </Typography>
        <List>
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
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          },
        }}>
          <List>
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
    </Box>
  );
};

export default Sidebar; 