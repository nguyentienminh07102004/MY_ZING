import { Box, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySongs } from '../apis/SongService';
import type { SongResponse } from '../types/Song';
import { SongCard } from '../components/SongCard';

const Uploaded = () => {
  const token = Cookies.get('token');
  const navigate = useNavigate();
  if (!token) {
    navigate('/login');
  }
  const [songs, setSongs] = useState<SongResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMySongs();
      setSongs(response.content);
    }
    fetchData();
  }, []);
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Bài Hát Đã Tải Lên
      </Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'flex-start',
        width: '100%'
      }}>
        {songs?.map((song) => (
          <Box key={song.id} sx={{ width: 'calc(100% / 3 - 16px)', flexShrink: 0, minWidth: '20rem' }}>
            <SongCard {...song} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Uploaded; 