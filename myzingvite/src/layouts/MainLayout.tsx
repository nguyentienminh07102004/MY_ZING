import { Box } from '@mui/material';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Player from '../components/Player';
import UploadButton from '../components/UploadButton';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: '70px', // Header height
            ml: '240px', // Sidebar width
            mb: '90px', // Player height
            overflow: 'auto',
            width: "100%",
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
      <Player />
      <UploadButton />
    </Box>
  );
};

export default MainLayout; 