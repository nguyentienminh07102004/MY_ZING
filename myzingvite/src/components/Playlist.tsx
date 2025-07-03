import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import type { PlaylistResponse } from "../types/Playlist";
import { useNavigate } from "react-router-dom";

export const PlaylistCard = ({ name, songs, image, id }: PlaylistResponse) => {
    const navigate = useNavigate();
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
    )
};