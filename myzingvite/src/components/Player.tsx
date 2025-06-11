import { useState, useRef, useEffect } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Slider,
  Stack,
  Avatar,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const Player = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const [musicUrl, setMusicUrl] = useState('https://myzing.s3.ap-northeast-1.amazonaws.com/1749567193490NTTE.mp3');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

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

  const handleProgressChange = (event: Event, newValue: number | number[]) => {
    if (audioRef.current && typeof newValue === 'number') {
      const time = (newValue * duration) / 100;
      audioRef.current.currentTime = time;
      setProgress(newValue);
    }
  };

  const handleVolumeChange = (event: Event, newValue: number) => {
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
        autoPlay
        src={musicUrl}
        ref={audioRef}
        loop={isRepeat}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: 300 }}>
        <Avatar
          variant="rounded"
          src="https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/4/c/c/c/4ccc7780abb5e8e2de84218f0f6d2ebd.jpg"
          alt="Song thumbnail"
          sx={{ width: 64, height: 64 }}
        />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Cánh Ba
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Nguyễn Trần Trung Quân
          </Typography>
        </Box>
        <Stack direction="row" spacing={1}>
          <IconButton size="small">
            <FavoriteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small">
            <MoreHorizIcon fontSize="small" />
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
        <IconButton>
          <QueueMusicIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Player; 