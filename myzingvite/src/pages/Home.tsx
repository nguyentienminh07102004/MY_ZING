import { Box, Typography, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import type { PlaylistResponse } from '../types/Playlist';
import { instance } from '../apis/instance';
import type { PagedModel } from '../types/PagedModel';

const PlaylistCard = ({ name, songs, image }: PlaylistResponse) => (
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
    }}
  >
    <CardMedia
      component="img"
      height="200"
      image={image || 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/4/c/c/c/4ccc7780abb5e8e2de84218f0f6d2ebd.jpg'}
      alt={name}
      sx={{ objectFit: 'cover' }}
    />
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {songs.length} bài hát
      </Typography>
    </CardContent>
  </Card>
);

const Home = () => {
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response: PagedModel<PlaylistResponse> = (await instance.get('/playlists/public')).data;
      setPlaylists(response.content);
    }
    fetchPlaylists();
  }, []);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Gợi Ý Cho Bạn
      </Typography>
      
      <Grid container spacing={3}>
        {playlists.map((playlist, index) => (
          <Grid component="div" item xs={12} sm={6} md={4} key={index}>
            <PlaylistCard {...playlist} />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>
        Mới Phát Hành
      </Typography>
      
      <Grid container spacing={3}>
        {playlists.map((playlist, index) => (
          <Grid component="div" item xs={12} sm={6} md={4} key={index}>
            <PlaylistCard {...playlist} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home; 