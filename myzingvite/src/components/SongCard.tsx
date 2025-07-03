import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { SongResponse } from "../types/Song";
import { useNavigate } from "react-router-dom";

export const SongCard = ({ id, name, imageUrl, singers }: SongResponse) => {
    const navigate = useNavigate();
    return (
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
}