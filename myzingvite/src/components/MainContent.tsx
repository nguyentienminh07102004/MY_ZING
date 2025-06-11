import { Box, Container, Typography, Card, CardContent, CardMedia, Stack, Avatar } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const featuredPlaylists = [
  {
    title: 'Top 100 Bài Hát Nhạc Trẻ Hay Nhất',
    description: 'Cập nhật những bài hát V-Pop hot nhất 2024',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/4/c/c/c/4ccc7780abb5e8e2de84218f0f6d2ebd.jpg',
  },
  {
    title: 'K-Pop Hits',
    description: 'Những bài hát K-Pop thịnh hành nhất',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/f/d/7/9/fd79808d2180de9a421afa6aff38953e.jpg',
  },
  {
    title: 'US-UK Hits',
    description: 'Top hits from US-UK artists',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/e/6/7/e/e67e25792bdb8e1c73452cc495a89495.jpg',
  },
  {
    title: 'Chill',
    description: 'Thư giãn với những giai điệu nhẹ nhàng',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/4/a/3/b/4a3b5265ee2c9e2c84a871f30192c6aa.jpg',
  },
];

const recentlyPlayed = [
  {
    title: 'Chìm Sâu',
    artist: 'MCK, Trung Trần',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/e/6/9/7/e697880504594fe396319f782fafb8c0.jpg',
  },
  {
    title: 'Nắng Ấm Xa Dần',
    artist: 'Sơn Tùng M-TP',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/8/a/8a06d7f6fad148d2a7f2c2ac1c05af71_1487040461.jpg',
  },
  {
    title: 'id 072019',
    artist: 'W/N',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/6/9/a/2/69a2e5ff6f3175b28dcc1219c0056690.jpg',
  },
  {
    title: 'Về Bên Anh',
    artist: 'Jack - J97',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/c/6/d/e/c6def069a1a885c41fe479358fa7c506.jpg',
  },
];

const topCharts = [
  {
    rank: 1,
    title: 'Người Như Anh',
    artist: 'Mai Tiến Dũng',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/3/9/5/b/395b2f6d1d4dfc8c680fe83a964fa1e5.jpg',
    listeners: '2.5M',
  },
  {
    rank: 2,
    title: 'Cắt Đôi Nỗi Sầu',
    artist: 'Tăng Duy Tân',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/d/b/6/c/db6cdb21c56c9080fbda8b917773a670.jpg',
    listeners: '2.1M',
  },
  {
    rank: 3,
    title: 'Anh Sai Rồi',
    artist: 'Sơn Tùng M-TP',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/f/a/1/6/fa164a95ff0bc936517b95cdc6322832.jpg',
    listeners: '1.8M',
  },
];

const artists = [
  {
    name: 'Sơn Tùng M-TP',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/8/a/8a06d7f6fad148d2a7f2c2ac1c05af71_1487040461.jpg',
    followers: '2.8M',
  },
  {
    name: 'Jack - J97',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/b/0/d/9/b0d9e2c5395c947579e2444bbb0fe344.jpg',
    followers: '1.9M',
  },
  {
    name: 'Hoàng Thùy Linh',
    image: 'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/avatars/7/0/70397761b7991cca98e754f0991b6b41_1487040456.jpg',
    followers: '1.5M',
  },
];

const MainContent = () => {
  return (
    <Box sx={{ flex: 1, overflow: 'auto', py: 3 }}>
      <Container>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Playlist Nổi Bật
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          {featuredPlaylists.map((playlist, index) => (
            <Box key={index} sx={{ width: { xs: '100%', sm: '45%', md: '23%' } }}>
              <Card 
                sx={{ 
                  height: '100%',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out',
                  },
                  cursor: 'pointer',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={playlist.image}
                  alt={playlist.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {playlist.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {playlist.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: { xs: '100%', md: '66.66%' } }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
              Nghe Gần Đây
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
              {recentlyPlayed.map((song, index) => (
                <Box key={index} sx={{ width: { xs: '100%', sm: '48%' } }}>
                  <Card 
                    sx={{ 
                      display: 'flex',
                      bgcolor: 'background.paper',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      cursor: 'pointer',
                    }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: 80, height: 80 }}
                      image={song.image}
                      alt={song.title}
                    />
                    <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {song.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {song.artist}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: { xs: '100%', md: '33.33%' } }}>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <PlayArrowIcon sx={{ ml: 1, color: 'primary.main' }} />
            </Typography>
            <Stack spacing={2}>
              {topCharts.map((song, index) => (
                <Card
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    cursor: 'pointer',
                  }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      width: 50,
                      textAlign: 'center',
                      color: index === 0 ? '#4a90e2' : index === 1 ? '#50e3c2' : '#e35050',
                      fontWeight: 700,
                    }}
                  >
                    {song.rank}
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={{ width: 60, height: 60, borderRadius: 1 }}
                    image={song.image}
                    alt={song.title}
                  />
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {song.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {song.artist}
                    </Typography>
                  </CardContent>
                  <Typography variant="caption" color="text.secondary" sx={{ pr: 2 }}>
                    {song.listeners}
                  </Typography>
                </Card>
              ))}
            </Stack>
            <Typography variant="h5" sx={{ mb: 3, mt: 4, fontWeight: 700 }}>
              Nghệ Sĩ Nổi Bật
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {artists.map((artist, index) => (
                <Box key={index} sx={{ width: 'calc(33.33% - 8px)' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <Avatar
                      src={artist.image}
                      alt={artist.name}
                      sx={{
                        width: 100,
                        height: 100,
                        mb: 1,
                        '&:hover': {
                          transform: 'scale(1.05)',
                          transition: 'transform 0.3s ease-in-out',
                        },
                        cursor: 'pointer',
                      }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {artist.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {artist.followers} followers
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default MainContent; 