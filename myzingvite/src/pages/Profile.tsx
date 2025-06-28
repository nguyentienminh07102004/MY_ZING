import { Avatar, Box, Button, CircularProgress, Paper, TextField, Typography } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Cookies from 'js-cookie';
import React, { useEffect, useState, type ChangeEvent } from 'react';
import { instance } from '../apis/instance';
import { changePasswordService, getMyInfo, uploadAvatar } from '../apis/UserService';
import type { UserResponse } from '../types/User';

const Profile = () => {
    const [profile, setProfile] = useState<UserResponse | null>(null);
    const [saving, setSaving] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const token = Cookies.get('token');
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await getMyInfo();
            setProfile(res);
        };
        fetchProfile();
    }, [reload]);

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await uploadAvatar(file);
            setReload(!reload);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const user = {
            firstName: profile?.firstName,
            lastName: profile?.lastName,
            phone: profile?.phone,
            address: profile?.address,
            dateOfBirth: profile?.dateOfBirth,
            gender: profile?.gender
        };
        await instance.put('/auth/users/update-info', user, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSaving(false);
        setReload(!reload);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setChangingPassword(true);
        try {
            await changePasswordService(passwordData);
            alert('Đổi mật khẩu thành công!');
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            alert('Đổi mật khẩu thất bại! Vui lòng kiểm tra mật khẩu hiện tại.');
        } finally {
            setChangingPassword(false);
        }
    };

    if (!profile) {
        return <Typography sx={{ mt: 4, textAlign: 'center' }}><CircularProgress color="secondary" /></Typography>;
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', p: 0, m: 0, bgcolor: 'background.default', display: "flex", justifyContent: "center", alignItems: 'center' }}>
            <Paper sx={{ width: '100%', minHeight: '100vh', p: { xs: 2, sm: 4 }, m: 0, borderRadius: 0, boxShadow: 'none', bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>Thông tin cá nhân</Typography>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
                    {/* Left side - Profile Information */}
                    <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar src={profile.picture || ''} sx={{ width: 100, height: 100, mb: 1 }} />
                            <Button variant="outlined" component="label" size="small">
                                Đổi ảnh đại diện
                                <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                            </Button>
                        </Box>
                        <form
                            onSubmit={handleSave}
                            style={{
                                display: 'grid',
                                gap: 25,
                                width: '100%',
                                margin: 0,
                                padding: 0,
                                gridTemplateColumns: "1fr 1fr"
                            }}>
                            <TextField label="Họ" name="firstName" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} style={{ width: "100%" }} sx={{ mb: 2 }} />
                            <TextField label="Tên" name="lastName" value={profile.lastName} style={{ width: "100%" }} sx={{ mb: 2 }} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
                            <TextField label="Email" name="email" value={profile.email} style={{ width: "100%" }} sx={{ mb: 2 }} />
                            <TextField label="Số điện thoại" name="phone" value={profile.phone} style={{ width: "100%" }} sx={{ mb: 2 }} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
                            <TextField label="Địa chỉ" name="address" value={profile.address} style={{ width: "100%" }} sx={{ mb: 2 }} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Ngày sinh"
                                    value={profile.dateOfBirth ? new Date(profile.dateOfBirth) : null}
                                    onChange={(newValue) => {
                                        setProfile({ ...profile, dateOfBirth: newValue?.toISOString() || '' });
                                    }}
                                    slotProps={{ textField: { style: { width: '100%' }, sx: { mb: 2 } } }}
                                />
                            </LocalizationProvider>
                            <TextField label="Giới tính" name="gender" value={profile.gender} style={{ width: "100%" }} sx={{ mb: 2 }} onChange={(e) => setProfile({ ...profile, gender: e.target.value })} />
                            <TextField label="Vai trò" value={profile.role} style={{ width: "100%" }} InputProps={{ readOnly: true }} sx={{ mb: 2 }} />
                            <div></div>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, width: '100%' }}>
                                <Button variant="contained" type='submit' disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
                            </Box>
                        </form>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Đổi mật khẩu</Typography>
                        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            <TextField
                                label="Mật khẩu hiện tại"
                                type="password"
                                value={passwordData.oldPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Mật khẩu mới"
                                type="password"
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Xác nhận mật khẩu mới"
                                type="password"
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                fullWidth
                                required
                            />
                            <Button 
                                variant="contained" 
                                type="submit" 
                                disabled={changingPassword}
                                sx={{ mt: 2 }}
                            >
                                {changingPassword ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                            </Button>
                        </form>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default Profile; 