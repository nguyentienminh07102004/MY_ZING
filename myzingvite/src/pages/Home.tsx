import { Box, Card, CardContent, CardMedia, Grid, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getPublicPlaylists } from '../apis/PlaylistService';
import { getAllSongs } from '../apis/SongService';
import type { PlaylistResponse } from '../types/Playlist';
import type { SongResponse } from '../types/Song';

const Home = () => {
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const navigate = useNavigate();
  const [playlistPage, setPlaylistPage] = useState(1);
  const [playlistTotalPages, setPlaylistTotalPages] = useState(1);
  const [songPage, setSongPage] = useState(1);
  const [songTotalPages, setSongTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const pageSize = 6;

  const PlaylistCard = ({ name, songs, image, id }: PlaylistResponse) => (
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
        onClick={() => navigate(`/playlist/${id}`)}
      />
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {songs?.length || 0} bài hát
        </Typography>
      </CardContent>
    </Card>
  );

  const SongCard = ({ id, name, imageUrl, singers }: SongResponse) => (
    <Card
      onClick={() => {
        localStorage.setItem('songId', id);
        const evt = new CustomEvent('songIdChange');
        window.dispatchEvent(evt);
        navigate(`/song/${id}`);
      }}
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

  useEffect(() => {
    const fetchData = async () => {
      const playlistsResponse = await getPublicPlaylists(playlistPage, pageSize);
      setPlaylists(playlistsResponse.content);
      setPlaylistTotalPages(playlistsResponse.page?.totalPages || 1);
      const songsResponse = await getAllSongs(songPage, pageSize, Object.fromEntries(searchParams.entries()));
      setSongs(songsResponse.content);
      setSongTotalPages(songsResponse.page?.totalPages || 1);
    };
    fetchData();
  }, [playlistPage, songPage, searchParams]);

  return (
    <Box sx={{
      width: "100%"
    }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>
        Gợi Ý Cho Bạn
      </Typography>

      <Grid container spacing={3}>
        {playlists?.map((playlist, index) => (
          <Grid key={index} sx={{ xs: 12, sm: 6, md: 4 }}>
            <PlaylistCard {...playlist} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={playlistTotalPages}
          page={playlistPage}
          onChange={(_, value) => setPlaylistPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
      {songs?.length != null && songs?.length > 0 && <>
        <Typography variant="h5" sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>
          Bài hát hay
        </Typography>

        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          width: "100%",
          justifyContent: 'flex-start',
        }}>
          {songs?.map((song, index) => (
            <Box key={index} sx={{
              width: '300px',
              height: '350px',
              flexShrink: 0
            }}
            >
              <SongCard {...song} />
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={songTotalPages}
            page={songPage}
            onChange={(_, value) => setSongPage(value)}
            color="primary"
            shape="rounded"
          />
        </Box>
      </>
      }
    </Box>

  );
};

export default Home;