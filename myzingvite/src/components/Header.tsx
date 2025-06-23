import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Avatar,
  Button,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  Menu
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import { instance } from '../apis/instance';
import Cookies from 'js-cookie';

const Header = () => {
  const [openSearchModal, setOpenSearchModal] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [singerIds, setSingerIds] = useState<string[]>([]);
  const [createDateFrom, setCreateDateFrom] = useState<Date | null>(null);
  const [createDateTo, setCreateDateTo] = useState<Date | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);
  const [avatar, setAvatar] = useState(null);
  const token = Cookies.get('token');

  const handleOpenSearchModal = () => setOpenSearchModal(true);
  const handleCloseSearchModal = () => setOpenSearchModal(false);

  const handleSingerIdsChange = (event: SelectChangeEvent<string[]>) => {
    setSingerIds(event.target.value as string[]);
  };

  const handleTagsChange = (event: SelectChangeEvent<string[]>) => {
    setTags(event.target.value as string[]);
  };

  const handleSortByChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
  };

  const handleSortOrderChange = (event: SelectChangeEvent) => {
    setSortOrder(event.target.value);
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
  const handleLogout = () => {
    Cookies.remove('token');
    navigate('/login');
    handleMenuClose();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await instance.get('/auth/users/my-info', {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      setAvatar(res.data.picture);
    }
    fetchProfile();
  }, []);

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

          <Button
            variant="outlined"
            color="primary"
            size="small"
            sx={{
              borderRadius: 999,
              textTransform: 'none',
              px: 2,
            }}
          >
            Nâng cấp VIP
          </Button>

          <IconButton color="primary">
            <SettingsIcon />
          </IconButton>

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
                >
                  <MenuItem value="1">Ca sĩ 1</MenuItem>
                  <MenuItem value="2">Ca sĩ 2</MenuItem>
                  <MenuItem value="3">Ca sĩ 3</MenuItem>
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
                >
                  <MenuItem value="pop">Pop</MenuItem>
                  <MenuItem value="rock">Rock</MenuItem>
                  <MenuItem value="jazz">Jazz</MenuItem>
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
                  <MenuItem value="date">Ngày tạo</MenuItem>
                  <MenuItem value="views">Lượt xem</MenuItem>
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
                  <MenuItem value="asc">Tăng dần</MenuItem>
                  <MenuItem value="desc">Giảm dần</MenuItem>
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