import { 
  AppBar, 
  Box, 
  IconButton, 
  InputBase, 
  Toolbar, 
  alpha,
  Avatar,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SettingsIcon from '@mui/icons-material/Settings';
import { styled } from '@mui/material/styles';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 999,
  backgroundColor: alpha(theme.palette.common.white, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  maxWidth: 440,
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const Header = () => {
  return (
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
          <IconButton color="primary">
            <ArrowBackIcon />
          </IconButton>
          <IconButton color="primary">
            <ArrowForwardIcon />
          </IconButton>
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Tìm kiếm bài hát, nghệ sĩ, lời bài hát..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </Search>

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
          src="/avatar.jpg"
          sx={{ width: 34, height: 34, cursor: 'pointer' }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header; 