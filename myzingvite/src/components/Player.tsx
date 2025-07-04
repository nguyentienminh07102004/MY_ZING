import DownloadIcon from '@mui/icons-material/Download';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import RepeatIcon from '@mui/icons-material/Repeat';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Select,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { getSongById, incrementNumberOfListner, likeSongService } from '../apis/SongService';
import type { SongResponse } from '../types/Song';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(50);
  const [song, setSong] = useState<SongResponse | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isRepeat, setIsRepeat] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [songId, setSongId] = useState('');
  const [isLike, setIsLike] = useState<boolean>(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const likeSong = async () => {
    await likeSongService(song?.id as string);
    setIsLike(!isLike);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (songId) {
        const res: SongResponse = await getSongById(songId);
        setSong(res);
        setIsLike(res.isLike);
        setIsPlaying(false);
        setCurrentTime(0);
        handleProgressChange(null, 0);
      }
    }
    fetchData();
  }, [songId]);

  useEffect(() => {
    const id = localStorage.getItem('songId') as string;
    setSongId(id);
    const handleStorageChange = () => {
      const id = localStorage.getItem('songId') as string;
      setSongId(id);
    };
    window.addEventListener('songIdChange', handleStorageChange);
    return () => window.removeEventListener('songIdChange', handleStorageChange);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate, song?.id]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressChange = (_: Event | null, newValue: number | number[]) => {
    if (audioRef.current && typeof newValue === 'number') {
      const time = (newValue * duration) / 100;
      audioRef.current.currentTime = time;
      setProgress(newValue);
    }
  };

  const handleVolumeChange = (_: Event, newValue: number) => {
    setVolume(newValue);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current;
      setCurrentTime(currentTime);
      setProgress((currentTime / duration) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleEnded = async () => {
    if (!isRepeat) setIsPlaying(false);
    await incrementNumberOfListner(songId as string);
  }

  const handleRepeat = () => {
    if (audioRef.current) {
      setIsRepeat(!isRepeat);
    }
  }
  const style = {
    border: "2px solid white",
  }
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 240,
        right: 0,
        height: 90,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
        px: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: (theme) => theme.zIndex.drawer + 2,
      }}
    >
      <audio
        src={song?.url}
        ref={audioRef}
        loop={isRepeat}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 300 }}>
        <Box sx={{ position: 'relative' }}>
          {isPlaying && (
            <Box
              component="img"
              src="https://img.icons8.com/?size=100&id=nOU8PgEZBfDr&format=png&color=000000"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                zIndex: 1,
                opacity: 0.8,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0.8,
                  },
                  '50%': {
                    transform: 'translate(-50%, -50%) scale(1)',
                    opacity: 1,
                  },
                  '100%': {
                    transform: 'translate(-50%, -50%) scale(0.8)',
                    opacity: 0.8,
                  },
                },
              }}
            />
          )}
          <Avatar
            variant="rounded"
            src={song?.imageUrl || 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/4/c/c/c/4ccc7780abb5e8e2de84218f0f6d2ebd.jpg'}
            alt={song?.name}
            sx={{ width: 64, height: 64 }}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {song?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {song?.singers?.map(singer => singer.fullName).join(", ")}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton size="small" onClick={() => likeSong()}>
            {isLike ? <FavoriteIcon color='error' /> : <FavoriteBorderIcon />}
          </IconButton>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton size="small">
            <ShuffleIcon fontSize="small" />
          </IconButton>
          <IconButton>
            <SkipPreviousIcon />
          </IconButton>
          <IconButton
            onClick={handlePlayPause}
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.1)',
                bgcolor: 'primary.dark',
              }
            }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
          <IconButton>
            <SkipNextIcon />
          </IconButton>
          <IconButton size="small" style={isRepeat ? style : undefined}>
            <RepeatIcon fontSize="small" onClick={handleRepeat} />
          </IconButton>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '75%' }}>
          <Typography variant="caption" color="text.secondary">
            {formatTime(currentTime)}
          </Typography>
          <Slider
            size="small"
            value={progress}
            onChange={handleProgressChange}
            sx={{
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                '&:before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(114, 0, 161, 0.16)',
                },
                '&.Mui-active': {
                  width: 20,
                  height: 20,
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatTime(duration)}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ width: 300, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          <IconButton size="small">
            <VolumeUpIcon fontSize="small" />
          </IconButton>
          <Slider
            size="small"
            value={volume}
            onChange={handleVolumeChange}
            sx={{
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                '&:before': {
                  boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(114, 0, 161, 0.16)',
                },
                '&.Mui-active': {
                  width: 20,
                  height: 20,
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.28,
              },
            }}
          />
        </Stack>
        <Select
          size="small"
          value={playbackRate}
          onChange={e => setPlaybackRate(Number(e.target.value))}
          sx={{ minWidth: 70 }}
        >
          <MenuItem value={0.5}>0.5x</MenuItem>
          <MenuItem value={0.75}>0.75x</MenuItem>
          <MenuItem value={1}>1x</MenuItem>
          <MenuItem value={1.25}>1.25x</MenuItem>
          <MenuItem value={1.5}>1.5x</MenuItem>
          <MenuItem value={2}>2x</MenuItem>
        </Select>
        <IconButton size="small" onClick={() => song?.id ? window.open(`${import.meta.env.VITE_SERVER_HOST}/public/songs/download/${localStorage.getItem('songId')}`) : {}}>
          <DownloadIcon fontSize="small" />
        </IconButton>
        <IconButton>
          <QueueMusicIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Player; 