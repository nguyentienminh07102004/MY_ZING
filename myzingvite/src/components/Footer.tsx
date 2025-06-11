import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Container, IconButton, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#1a1a1a',
        color: 'white',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container>
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          mx: -2,
        }}>
          <Box sx={{ 
            width: { xs: '100%', sm: '33.33%' },
            p: 2,
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              MYZING
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Creating amazing experiences through innovative technology solutions.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', sm: '33.33%' },
            p: 2,
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Quick Links
            </Typography>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              About Us
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Services
            </Link>
            <Link href="#" color="inherit" display="block" sx={{ mb: 1 }}>
              Contact
            </Link>
          </Box>
          <Box sx={{ 
            width: { xs: '100%', sm: '33.33%' },
            p: 2,
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
              Contact Info
            </Typography>
            <Typography variant="body2" paragraph>
              123 Main Street
              <br />
              New York, NY 10001
            </Typography>
            <Typography variant="body2" paragraph>
              Phone: (123) 456-7890
              <br />
              Email: info@myzing.com
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            borderTop: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            mt: 4,
            pt: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.6)">
            © {new Date().getFullYear()} MyZing. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 