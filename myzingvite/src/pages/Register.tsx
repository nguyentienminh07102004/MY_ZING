import { useState } from 'react';
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    MenuItem,
    InputAdornment,
    Grid
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type { UserRegister } from '../types/User';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../apis/UserService';

const genders = [
    { value: 'male', label: 'Nam' },
    { value: 'female', label: 'Nữ' },
    { value: 'other', label: 'Khác' },
];

const Register = () => {
    const [form, setForm] = useState<UserRegister>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: any = {};
        if (!form.firstName) newErrors.firstName = 'Vui lòng nhập họ';
        if (!form.lastName) newErrors.lastName = 'Vui lòng nhập tên';
        if (!form.email) newErrors.email = 'Vui lòng nhập email';
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Email không hợp lệ';
        if (!form.password) newErrors.password = 'Vui lòng nhập mật khẩu';
        else if (form.password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Vui lòng nhập lại mật khẩu';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp';
        if (!form.phone) newErrors.phone = 'Vui lòng nhập số điện thoại';
        if (!form.address) newErrors.address = 'Vui lòng nhập địa chỉ';
        if (!form.dateOfBirth) newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh';
        if (!form.gender) newErrors.gender = 'Vui lòng chọn giới tính';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            await registerUser(form);
            navigate('/login');
        }
    };

    return (
        <Box sx={{ background: 'linear-gradient(180deg, #170f23 0%, #100c18 100%)', minHeight: '100vh', width: "100vw", color: 'white', py: 8 }}>
            <Container maxWidth="sm">
                <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', p: 4, borderRadius: 2, boxShadow: 3 }}>
                    <Typography variant="h4" align="center" fontWeight={700} mb={3}>
                        Đăng ký tài khoản
                    </Typography>
                    <form onSubmit={handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Họ"
                                    name="firstName"
                                    value={form.firstName}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.firstName}
                                    helperText={errors.firstName}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Tên"
                                    name="lastName"
                                    value={form.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.lastName}
                                    helperText={errors.lastName}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Mật khẩu"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button onClick={() => setShowPassword(v => !v)} sx={{ minWidth: 0, color: 'white' }}>
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </Button>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Nhập lại mật khẩu"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{
                                        style: { color: 'white' },
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <Button onClick={() => setShowConfirmPassword(v => !v)} sx={{ minWidth: 0, color: 'white' }}>
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </Button>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Số điện thoại"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.phone}
                                    helperText={errors.phone}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={12}>
                                <TextField
                                    label="Địa chỉ"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    label="Ngày sinh"
                                    name="dateOfBirth"
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.dateOfBirth}
                                    helperText={errors.dateOfBirth}
                                    variant="outlined"
                                    InputLabelProps={{ shrink: true, style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    label="Giới tính"
                                    name="gender"
                                    value={form.gender}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.gender}
                                    helperText={errors.gender}
                                    variant="outlined"
                                    InputLabelProps={{ style: { color: 'white' } }}
                                    InputProps={{ style: { color: 'white' } }}
                                    sx={{ bgcolor: 'rgba(255,255,255,0.08)' }}
                                >
                                    {genders.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={12}>
                                <Button type="submit" variant="contained" color="secondary" fullWidth size="large" sx={{ mt: 2, fontWeight: 700 }}>
                                    Đăng ký
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    size="large"
                                    sx={{ mt: 2, fontWeight: 700 }}
                                    onClick={() => navigate('/login')}
                                >
                                    Quay về đăng nhập
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};

export default Register; 