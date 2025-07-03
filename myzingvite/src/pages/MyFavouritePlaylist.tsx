import { Box, Pagination, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyPlaylist } from "../apis/PlaylistService";
import { PlaylistCard } from "../components/Playlist";
import type { PlaylistResponse } from "../types/Playlist";

export default function MyFavouritePlaylist() {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    if (!token) navigate('/login');

    const [playlists, setPlaylists] = useState<PlaylistResponse[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMyPlaylist(page, 10);
            setPlaylists(res.content);
            setTotalPages(res.page.totalPages);
        }
        fetchData();
    }, [page]);
    return <>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: '0.875rem' }}>
            {playlists.map(playlist => (
                <PlaylistCard {...playlist} />
            ))}
        </Box>
        {totalPages ? <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Pagination
                page={page}
                shape="rounded"
                count={totalPages}
                color="primary"
                onChange={(_, pageNumber) => setPage(pageNumber)} />
        </Box> : <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">Không có playlist nào!</Typography>
            </Box>
        </>}
    </>
}