import { Box, Grid, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPublicPlaylists } from '../apis/PlaylistService';
import { getAllSongs } from '../apis/SongService';
import { PlaylistCard } from '../components/Playlist';
import { SongCard } from '../components/SongCard';
import type { PlaylistResponse } from '../types/Playlist';
import type { SongResponse } from '../types/Song';

const Home = () => {
  const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
  const [songs, setSongs] = useState<SongResponse[]>([]);
  const [playlistPage, setPlaylistPage] = useState(1);
  const [playlistTotalPages, setPlaylistTotalPages] = useState(1);
  const [songPage, setSongPage] = useState(1);
  const [songTotalPages, setSongTotalPages] = useState(1);
  const [searchParams] = useSearchParams();
  const pageSize = 6;
  
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
          {songs?.map((song) => (
            <Box key={song.id} sx={{
              width: 'calc(100% / 3 - 1.5rem)',
              flexShrink: 0,
              minWidth: '20rem'
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