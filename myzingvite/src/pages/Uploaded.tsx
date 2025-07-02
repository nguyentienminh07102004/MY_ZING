import { Box, Card, CardContent, CardMedia, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySongs } from '../apis/SongService';
import type { SongResponse } from '../types/Song';

const SongCard = ({ name, imageUrl, singers, id }: SongResponse) => {
  const navigate = useNavigate();
  const token = Cookies.get('token');
  if (!token) {
    navigate('/login');
  }

  return (
    <Card
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
        },
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={imageUrl || 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/4/c/c/c/4ccc7780abb5e8e2de84218f0f6d2ebd.jpg'}
        alt={name}
        sx={{ objectFit: 'cover' }}
        onClick={() => {
          localStorage.setItem('songId', id);
          const evt = new CustomEvent('songIdChange');
          window.dispatchEvent(evt);
          navigate(`/song/${id}`);
        }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography
          variant="h6"
          sx={{
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {singers.map(singer => singer.fullName).join(', ')}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Uploaded = () => {
  const [songs, setSongs] = useState<SongResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getMySongs();
      setSongs(response.content);
    }
    fetchData();
  }, []);
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Bài Hát Đã Tải Lên
      </Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'space-between'
      }}>
        {songs?.map((song, index) => (
          <Box key={index} sx={{ width: 'calc(33.333% - 16px)' }}>
            <SongCard {...song} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Uploaded; 