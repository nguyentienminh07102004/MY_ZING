import { Fab, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import UploadModal from './UploadModal';

const UploadButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          bottom: 100,
          right: 24,
          zIndex: 1200,
        }}
      >
        <Fab
          color="primary"
          aria-label="upload"
          onClick={() => setOpen(true)}
          sx={{
            boxShadow: 3,
            '&:hover': {
              transform: 'scale(1.1)',
            },
            transition: 'transform 0.2s',
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
      <UploadModal open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default UploadButton; 