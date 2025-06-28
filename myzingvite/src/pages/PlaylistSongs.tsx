import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import { Avatar, Box, Button, Checkbox, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Paper, Typography } from '@mui/material';
import type { AxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addSongToPlaylist, getPlaylistById, removeSongFromPlaylistService, likePlaylistService } from '../apis/PlaylistService';
import { getAllSongs, likeSongService } from '../apis/SongService';
import type { PlaylistResponse } from '../types/Playlist';
import type { SongResponse } from '../types/Song';

const PlaylistSongs = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<PlaylistResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [addSongOpen, setAddSongOpen] = useState(false);
  const [allSongs, setAllSongs] = useState<SongResponse[]>([]);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [adding, setAdding] = useState(false);
  const [songPage, setSongPage] = useState(1);
  const [hasMoreSongs, setHasMoreSongs] = useState(true);
  const [loadingSongs, setLoadingSongs] = useState(false);
  const scrollableRef = useRef<HTMLDivElement>(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchPlaylist = async () => {
      try {
        const data = await getPlaylistById(id as string);
        setPlaylist(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching playlist:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [id, reload]);

  const handlePlaySong = (song: SongResponse) => {
    localStorage.setItem('songId', song.id);
  };

  const handleToggleLike = async (songId: string) => {
    try {
      await likeSongService(songId);
      navigate(0);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const fetchAllSongs = async (page = 1, append = false) => {
    setLoadingSongs(true);
    const res = await getAllSongs(page, 10);
    const newSongs = res.content || [];
    setAllSongs(prev => append ? [...prev, ...newSongs] : newSongs);
    setHasMoreSongs(newSongs.length > 0);
    setLoadingSongs(false);
  };

  const handleOpenAddSong = () => {
    setAddSongOpen(true);
    setSongPage(1);
    setAllSongs([]);
    fetchAllSongs(1, false);
  };

  const handleCloseAddSong = () => {
    setAddSongOpen(false);
    setSelectedSongIds([]);
  };

  const handleAddSongs = async () => {
    if (!id || selectedSongIds.length === 0) return;
    setAdding(true);
    try {
      await addSongToPlaylist(id, selectedSongIds);
      handleCloseAddSong();
    } catch (e) {
      alert((e as AxiosError).message);
    } finally {
      setAdding(false);
      setReload(!reload);
    }
  };

  const handleScroll = () => {
    const div = scrollableRef.current;
    if (!div || loadingSongs || !hasMoreSongs) return;
    if (div.scrollHeight - div.scrollTop - div.clientHeight < 60) {
      const nextPage = songPage + 1;
      setSongPage(nextPage);
      fetchAllSongs(nextPage, true);
    }
  };

  const handleRemoveSong = async (songId: string) => {
    if (!id) return;
    try {
      await removeSongFromPlaylistService(id, [songId]);
      setReload(!reload);
    } catch (e) {
      alert('Xoá bài hát thất bại!');
    }
  };

  const handleTogglePlaylistLike = async () => {
    if (!id || !playlist) return;
    try {
      await likePlaylistService(id);
      navigate(0);
    } catch (error) {
      console.error('Error toggling playlist like:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography><CircularProgress color="secondary" /></Typography>
      </Box>
    );
  }

  if (!playlist) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Typography>Playlist not found</Typography>
      </Box>
    );
  }
  console.log(playlist)
  return (
    <Box sx={{
      background: 'linear-gradient(180deg, rgba(23,15,35,1) 0%, rgba(16,12,24,1) 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Container maxWidth="lg">
        <Box sx={{
          py: 6,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          gap: 4
        }}>
          <Box sx={{
            position: 'relative',
            '&:hover .play-overlay': {
              opacity: 1
            }
          }}>
            <Avatar
              src={playlist.image}
              sx={{
                width: { xs: 200, md: 300 },
                height: { xs: 200, md: 300 },
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
              }}
              variant="rounded"
            />
            <Box className="play-overlay" sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.5)',
              opacity: 0,
              transition: 'opacity 0.3s',
              borderRadius: 2
            }}>
              <PlayCircleIcon sx={{ fontSize: 80, color: '#1db954' }} />
            </Box>
          </Box>

          <Box sx={{
            flex: 1,
            textAlign: { xs: 'center', md: 'left' }
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                {playlist.name}
              </Typography>
              <IconButton onClick={handleOpenAddSong} size="small" sx={{ color: 'white' }}>
                <AddIcon />
              </IconButton>
              <IconButton 
                onClick={() => handleTogglePlaylistLike()} 
                size="small" 
                sx={{ 
                  color: playlist.liked ? '#ff6b6b' : 'white',
                  '&:hover': {
                    color: playlist.liked ? '#ff5252' : '#ff6b6b'
                  }
                }}
              >
                {playlist.liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255,255,255,0.7)',
                mb: 1
              }}
            >
              {playlist.description}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                mb: 3
              }}
            >
              Created by: {playlist.email} • {playlist.songs.length} songs
            </Typography>
          </Box>
        </Box>

        <Dialog open={addSongOpen} onClose={handleCloseAddSong} maxWidth="sm" fullWidth>
          <DialogTitle>Thêm bài hát vào playlist</DialogTitle>
          <DialogContent>
            <div
              ref={scrollableRef}
              style={{ maxHeight: 350, overflow: 'auto' }}
              onScroll={handleScroll}
            >
              <List>
                {allSongs.map(song => (
                  <ListItem key={song.id} onClick={() => {
                    setSelectedSongIds(ids => ids.includes(song.id) ? ids.filter(id => id !== song.id) : [...ids, song.id]);
                  }}
                    sx={{ cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  >
                    <ListItemAvatar>
                      <Avatar src={song.imageUrl} variant="rounded" />
                    </ListItemAvatar>
                    <ListItemText
                      primary={song.name}
                      secondary={song.singers.map(s => s.fullName).join(', ')}
                    />
                    <ListItemSecondaryAction>
                      <Checkbox
                        edge="end"
                        checked={selectedSongIds.includes(song.id)}
                        tabIndex={-1}
                        disableRipple
                        onChange={() => {
                          setSelectedSongIds(ids => ids.includes(song.id) ? ids.filter(id => id !== song.id) : [...ids, song.id]);
                        }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
                {loadingSongs && <Typography align="center" sx={{ p: 2 }}><CircularProgress color="secondary" /></Typography>}
              </List>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddSong}>Hủy</Button>
            <Button onClick={handleAddSongs} variant="contained" disabled={adding || selectedSongIds.length === 0}>{adding ? 'Đang thêm...' : 'Thêm vào playlist'}</Button>
          </DialogActions>
        </Dialog>

        <Paper sx={{
          bgcolor: 'rgba(255,255,255,0.03)',
          borderRadius: 2,
          mt: 2
        }}>
          <Box sx={{ p: 2, display: 'flex', color: 'rgba(255,255,255,0.6)' }}>
            <Typography sx={{ width: 50 }}>#</Typography>
            <Typography sx={{ flex: 1 }}>TITLE</Typography>
            <Box sx={{ width: 100, display: 'flex', justifyContent: 'center' }}>
              <AccessTimeIcon />
            </Box>
          </Box>
          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

          <List sx={{ py: 0 }}>
            {playlist.songs.map((song, index) => (
              <ListItem
                key={song.id}
                sx={{
                  py: 1,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  '&:hover .play-button': {
                    opacity: 1,
                    visibility: 'visible'
                  },
                  '&:hover .song-number': {
                    opacity: 0,
                    visibility: 'hidden'
                  },
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onClick={() => handlePlaySong(song)}
              >
                <Box sx={{
                  width: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Typography
                    className="song-number"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      position: 'absolute',
                      opacity: 1,
                      visibility: 'visible',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {index + 1}
                  </Typography>
                  <IconButton
                    className="play-button"
                    size="small"
                    sx={{
                      color: 'white',
                      position: 'absolute',
                      opacity: 0,
                      visibility: 'hidden',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Box>

                <Box sx={{ display: 'flex', flex: 1, alignItems: 'center', ml: 1 }}>
                  <ListItemAvatar>
                    <Avatar
                      src={song.imageUrl}
                      variant="rounded"
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: 'white' }}>
                        {song.name}
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        {song.singers?.map(singer => singer.fullName).join(', ')}
                      </Typography>
                    }
                  />
                </Box>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  width: 100,
                  justifyContent: 'center'
                }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(song.id);
                    }}
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    {song.isLike ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveSong(song.id);
                    }}
                    sx={{ color: 'white', '&:hover': { color: 'error.main' } }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
};

export default PlaylistSongs; 