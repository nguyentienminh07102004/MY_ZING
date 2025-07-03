import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SongResponse } from "../types/Song";
import { Box, Pagination, Typography } from "@mui/material";
import { getMyFavouriteSong } from "../apis/SongService";
import { SongCard } from "../components/SongCard";

export default function MyFavouritePage() {
    const token = Cookies.get('token');
    const navigate = useNavigate();
    if (!token) navigate('/login');
    const [songList, setSongList] = useState<SongResponse[]>([]);
    const [page, setPage] = useState<{ number: number, totalPages: number }>({
        number: 1,
        totalPages: 0
    });

    useEffect(() => {
        const fetchData = async () => {
            const res = await getMyFavouriteSong(page.number, 10);
            setPage({
                number: res.page.number,
                totalPages: res.page.totalPages
            });
            setSongList(res.content);
        }
        fetchData();
    }, [page.number]);
    return <>
        <Box sx={{ display: 'flex', gap: 4, width: '100%', marginBottom: '1rem' }}>
            {songList.map(song => (
                <Box key={song.id} sx={{ width: 'calc(100% / 3 - 16px)', flexShrink: 0, minWidth: '20rem' }}>
                    <SongCard {...song} />
                </Box>
            ))}
        </Box>
        {page.totalPages ? <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <Pagination
                page={page.number + 1}
                shape="rounded"
                count={page.totalPages}
                color="primary"
                onChange={(_, pageNumber) => setPage({ ...page, number: pageNumber })} />
        </Box> : <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">Không có bài hát yêu thích nào!</Typography>
            </Box>
        </>}
    </>
}