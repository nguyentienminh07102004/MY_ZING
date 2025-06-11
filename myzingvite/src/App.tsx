import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import MainLayout from './layouts/MainLayout';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ThemeProvider>
  );
}

export default App;
