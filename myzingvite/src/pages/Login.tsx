import GoogleIcon from '@mui/icons-material/Google';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserLoginService } from '../apis/UserService';
import { instance } from '../apis/instance';

const SocialButton = styled(IconButton)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1),
  marginRight: theme.spacing(2),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const [searchParams, _] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      const loginWithGoogle = async () => {
        const res = await instance.post(`/public/users/login/google`, {
          code,
          redirectUri: "http://localhost:5173/login"
        });
        Cookies.set('token', res.data.token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) });
        navigate('/');
      }
      loginWithGoogle();
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res: {token: string} = await UserLoginService(formData.email, formData.password);
    Cookies.set('token', res.token, { expires: new Date(Date.now() + 1000 * 60 * 60 * 24) });
    navigate('/');
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'auto',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 60%)',
          animation: 'rotate 20s linear infinite',
        },
        '@keyframes rotate': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
      }}
    >
      <Paper
        elevation={24}
        sx={{
          width: '100%',
          maxWidth: '450px',
          mx: 2,
          p: { xs: 2, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(42, 33, 58, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          transition: 'transform 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
          },
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: 'white',
            mb: 4,
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Welcome to MyZing
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(255, 255, 255, 0.7)',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 2 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.light',
                },
              }}
            >
              Forgot password?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 3,
              py: 1.5,
              bgcolor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'primary.dark',
                transform: 'scale(1.02)',
                boxShadow: '0 6px 20px rgba(114, 0, 161, 0.4)',
              },
              transition: 'all 0.3s ease-in-out',
            }}
          >
            Sign In
          </Button>

          <Divider sx={{ 
            my: 3,
            '&::before, &::after': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              OR
            </Typography>
          </Divider>

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <SocialButton sx={{ color: 'white' }} onClick={() => {
              window.location.href = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=310493825026-ciu50vhe0li1jp8bc9l5h8ajvhdouin8.apps.googleusercontent.com&redirect_uri=http://localhost:5173/login&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent';
            }}>
              <GoogleIcon />
            </SocialButton>
          </Box>

          <Typography variant="body2" align="center" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
            Don't have an account?
            <Typography
              component="span"
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.light',
                },
              }}
            >
              Sign up
            </Typography>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login; 