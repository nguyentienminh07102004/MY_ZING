import { Avatar, Box, CircularProgress, Paper, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteSongByIdService, getSongById } from '../apis/SongService';
import type { SongResponse } from '../types/Song';
import ConfirmDialog from './ConfirmDialog';
import SongEditModal from './SongEditModal';
import RelatedSongs from '../components/RelatedSongs';

const SongDetail = () => {
  const { id } = useParams();
  const [song, setSong] = useState<SongResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        setLoading(true);
        const song: SongResponse = await getSongById(id);
        setSong(song);
      }
      catch (e) {
        setError("Not found");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error || !song) return <Typography color="error" sx={{ mt: 8, textAlign: 'center' }}>{error || 'Không tìm thấy bài hát!'}</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 6, p: { xs: 2, md: 3 } }}>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: { xs: 2, md: 4 }
      }}>
        <Box>
          <Paper elevation={3} sx={{
            p: { xs: 2, md: 3 },
            display: 'flex',
            gap: { xs: 2, md: 3 },
            alignItems: 'flex-start',
            height: 'fit-content',
            flexDirection: { xs: 'column', sm: 'row' }
          }}>
            <Avatar
              src={song.imageUrl}
              alt={song.name}
              variant="rounded"
              sx={{
                width: { xs: 120, sm: 160 },
                height: { xs: 120, sm: 160 },
                mr: { xs: 0, sm: 3 },
                mb: { xs: 2, sm: 0 },
                alignSelf: { xs: 'center', sm: 'flex-start' }
              }}
            />
            <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
              <Typography
                variant="h4"
                fontWeight={700}
                gutterBottom
                sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
              >
                {song.name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Ca sĩ: {song.singers.map(s => s.fullName).join(', ')}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {song.description}
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 3 }}
                sx={{ mt: 2, mb: 2 }}
              >
                <Typography variant="body2">Ngày tạo: {new Date(song.createdDate).toLocaleDateString()}</Typography>
                <Typography variant="body2">Lượt nghe: {song.numberOfListens}</Typography>
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={{ xs: 1, sm: 3 }}
                sx={{ mt: 2, mb: 2 }}>
                <Typography variant='body2'>Người tạo: {song.email}</Typography>
              </Stack>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}
              >
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#1976d2',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                    minWidth: '80px'
                  }}
                  onClick={() => setEditOpen(true)}
                >
                  Sửa
                </button>
                <button
                  style={{
                    padding: '8px 16px',
                    background: '#d32f2f',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontWeight: 600,
                    minWidth: '80px'
                  }}
                  onClick={() => setConfirmOpen(true)}
                >
                  Xoá
                </button>
              </Stack>
            </Box>
          </Paper>
        </Box>
        <Box>
          <RelatedSongs songId={id as string} currentSongName={song.name} />
        </Box>
      </Box>

      <SongEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        song={song}
        onSave={updatedSong => setSong(updatedSong)}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Xác nhận xoá bài hát"
        content="Bạn có chắc chắn muốn xoá bài hát này?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (!id) return;
          await deleteSongByIdService(id as string);
          navigate(-1);
        }}
      />
    </Box>
  );
};

export default SongDetail; 