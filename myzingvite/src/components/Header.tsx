import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import type { SelectChangeEvent } from '@mui/material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMyInfo, logout } from '../apis/UserService';
import type { SingerResponse } from '../types/Singer';
import { getAllSinger } from '../apis/SingerService';
import type { TagResponse } from '../types/Tag';
import { getAllTags } from '../apis/TagService';

const Header = () => {
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [singerIds, setSingerIds] = useState<string[]>([]);
  const [createDateFrom, setCreateDateFrom] = useState<Date | null>(null);
  const [createDateTo, setCreateDateTo] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('createdDate');
  const [sortOrder, setSortOrder] = useState<'Asc' | 'Desc'>('Desc');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [avatar, setAvatar] = useState<string | null>(null);
  const pathName = useLocation().pathname;
  const [singerList, setSingerList] = useState<SingerResponse[]>([]);
  const [singerPage, setSingerPage] = useState(1);
  const [singerHasMore, setSingerHasMore] = useState(true);
  const [tagList, setTagList] = useState<TagResponse[]>([]);
  const [tagPage, setTagPage] = useState(1);
  const [tagHasMore, setTagHasMore] = useState(true);

  const handleOpenSearchModal = () => setOpenSearchModal(true);
  const handleCloseSearchModal = () => {
    const params = new URLSearchParams();
    if (searchName) params.set('name', searchName);
    if (singerIds.length > 0) params.set('singerIds', singerIds.join(','));
    if (createDateFrom) params.set('createDateFrom', createDateFrom.toISOString());
    if (createDateTo) params.set('createDateTo', createDateTo.toISOString());
    if (tags.length > 0) params.set('tags', tags.join(','));
    if (sortBy) params.set('sortBy', sortBy);
    if (sortOrder) params.set('sortOrder', sortOrder);
    navigate(`${pathName}?${params.toString()}`);
    setOpenSearchModal(false);
  };

  const handleSingerIdsChange = (event: SelectChangeEvent<string[]>) => {
    setSingerIds(event.target.value as string[]);
  };

  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    setTags(event.target.value as string[]);
  };

  const handleSortByChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value as ('Asc' | 'Desc'));
  };

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleTagScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const {scrollHeight, scrollTop, clientHeight} = e.target as HTMLDivElement;
    if (scrollHeight - 50 <= scrollTop + clientHeight && tagHasMore) {
      setTagPage(tagPage + 1);
    }
  }

  useEffect(() => {
    const getTagList = async () => {
      const res = await getAllTags(tagPage, 10);
      setTagList(prev => [...prev, ...res.content]);
      setTagHasMore(res.content.length > 0);
    }
    getTagList();
  }, [tagPage]);

  const handleLogout = async () => {
    try {
      await logout();
      Cookies.remove('token');
    } catch { }
    finally {
      navigate('/login');
      handleMenuClose();
    }
  };

  useEffect(() => {
    const getSingers = async () => {
      if (singerHasMore) {
        const singers = await getAllSinger(singerPage, 10);
        setSingerList(prev => [...prev, ...singers.content]);
        setSingerHasMore(singers.page?.totalPages > 0);
      }
    }
    getSingers();
  }, [singerPage]);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = await getMyInfo();
      setAvatar(user.picture);
    }
    fetchProfile();
  }, []);

  const handleSingerScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const {scrollHeight, scrollTop, clientHeight} = e.target as HTMLDivElement;
    console.log(scrollHeight <= scrollTop + clientHeight + 50, singerHasMore, singerList.length);
    if (scrollHeight <= scrollTop + clientHeight + 50) {
      setSingerPage(singerPage + 1);
    }
  }
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 'none',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ minHeight: 70, gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton color="primary" onClick={() => navigate(-1)}>
              <ArrowBackIcon />
            </IconButton>
            <IconButton color="primary" onClick={() => navigate(1)}>
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          <IconButton
            color="primary"
            onClick={handleOpenSearchModal}
            sx={{
              borderRadius: 2,
              '&:hover': { bgcolor: 'action.hover' }
            }}
          >
            <SearchIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />

          <Avatar
            alt="User Avatar"
            src={avatar || "/avatar.jpg"}
            sx={{ width: 34, height: 34, cursor: 'pointer' }}
            onClick={handleAvatarClick}
          />
          <Menu
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Modal
        open={openSearchModal}
        onClose={handleCloseSearchModal}
        aria-labelledby="search-modal-title"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 800,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography id="search-modal-title" variant="h6" component="h2" mb={3}>
            Tìm kiếm
          </Typography>

          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Tên bài hát"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Ca sĩ</InputLabel>
                <Select
                  multiple
                  value={singerIds}
                  onChange={handleSingerIdsChange}
                  label="Ca sĩ"
                  MenuProps={{
                    slotProps: {
                      paper: {
                        onScroll: handleSingerScroll,
                        style: {
                          maxHeight: 300
                        }
                      },
                    }
                  }}
                  renderValue={(value) => (<Box style={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip label={value} />
                  </Box>)}
                >
                  {singerList.map(singer => (
                    <MenuItem value={singer.id} key={singer.id}>{singer.fullName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Từ ngày"
                  value={createDateFrom}
                  onChange={(newValue) => setCreateDateFrom(newValue)}
                  sx={{ width: '100%' }}
                />
                <DatePicker
                  label="Đến ngày"
                  value={createDateTo}
                  onChange={(newValue) => setCreateDateTo(newValue)}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={tags}
                  onChange={handleTagsChange}
                  label="Tags"
                  MenuProps={{
                    slotProps: {
                      paper: {
                        style: {
                          maxHeight: 300
                        },
                        onScroll: handleTagScroll
                      },
                    }
                  }}
                  renderValue={(value) => (
                    <Chip label={value} />
                  )}
                >
                  {tagList.map(tag => (
                    <MenuItem value={tag.id}>{tag.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  onChange={handleSortByChange}
                  label="Sắp xếp theo"
                >
                  <MenuItem value="name">Tên</MenuItem>
                  <MenuItem value="createdDate">Ngày tạo</MenuItem>
                  <MenuItem value="numberOfListener">Lượt xem</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Thứ tự</InputLabel>
                <Select
                  value={sortOrder}
                  onChange={handleSortOrderChange}
                  label="Thứ tự"
                >
                  <MenuItem value="Asc">Tăng dần</MenuItem>
                  <MenuItem value="Desc">Giảm dần</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ width: '100%' }} />
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseSearchModal}
              sx={{ alignSelf: 'flex-end' }}
            >
              Tìm kiếm
            </Button>
          </Stack>
        </Box>
      </Modal>
    </>
  );
};

export default Header; 