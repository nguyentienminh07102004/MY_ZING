import { Box, Card, CardContent, CardMedia, Skeleton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRelatedSongs } from '../apis/SongService';
import type { SongResponse } from '../types/Song';

interface RelatedSongsProps {
    songId: string;
    currentSongName: string;
}

const RelatedSongs = ({ songId }: RelatedSongsProps) => {
    const [relatedSongs, setRelatedSongs] = useState<SongResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelatedSongs = async () => {
            try {
                setLoading(true);
                const response = await getRelatedSongs(songId, 6);
                setRelatedSongs(response);
            } catch (error) {
                console.error('Error fetching related songs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedSongs();
    }, [songId]);

    const handleSongClick = (songId: string) => {
        localStorage.setItem('songId', songId);
        const evt = new CustomEvent('songIdChange');
        window.dispatchEvent(evt);
        navigate(`/song/${songId}`);
    };

    if (loading) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    Bài hát liên quan
                </Typography>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 2
                }}>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <Card key={item} sx={{ height: 200 }}>
                            <Skeleton variant="rectangular" height={140} />
                            <CardContent sx={{ p: 2 }}>
                                <Skeleton variant="text" width="80%" height={20} sx={{ mb: 1 }} />
                                <Skeleton variant="text" width="60%" height={16} />
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        );
    }

    if (relatedSongs.length === 0) {
        return (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                    Bài hát liên quan
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    Không có bài hát liên quan
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
                Bài hát liên quan
            </Typography>
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                gap: 2
            }}>
                {relatedSongs.map((song) => (
                    <Card
                        key={song.id}
                        sx={{
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: 6,
                                '& .MuiCardMedia-root': {
                                    transform: 'scale(1.05)'
                                }
                            }
                        }}
                        onClick={() => handleSongClick(song.id)}
                    >
                        <CardMedia
                            component="img"
                            height="140"
                            image={song.imageUrl}
                            alt={song.name}
                            sx={{
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                        />
                        <CardContent sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                noWrap
                                sx={{ mb: 1 }}
                                title={song.name}
                            >
                                {song.name}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                                sx={{ mb: 2, flexGrow: 1 }}
                                title={song.singers.map(s => s.fullName).join(', ')}
                            >
                                {song.singers.map(s => s.fullName).join(', ')}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                                <Typography variant="caption" color="text.secondary">
                                    {song.numberOfListens} lượt nghe
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(song.createdDate).toLocaleDateString()}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>
    );
};

export default RelatedSongs; 