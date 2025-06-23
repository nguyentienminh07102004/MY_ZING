import { Box, Typography, Paper, TextField, Button, Avatar, CircularProgress } from '@mui/material';
import React, { useEffect, useState, type ChangeEvent } from 'react';
import { instance } from '../apis/instance';
import Cookies from 'js-cookie';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface ProfileData {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    gender: string;
    picture: string;
    email: string;
    role: string;
}

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [saving, setSaving] = useState(false);
    const token = Cookies.get('token');
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const res = await instance.get('/auth/users/my-info', {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setProfile(res.data);
        };
        fetchProfile();
    }, [reload]);

    const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            const res = await instance.put('/auth/users/upload-avatar', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(res.data);
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
        console.log(profile);
        await instance.put('/auth/users/update-info', user, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        setSaving(false);
        setReload(!reload);
    };

    if (!profile) {
        return <Typography sx={{ mt: 4, textAlign: 'center' }}><CircularProgress color="secondary" /></Typography>;
    }

    return (
        <Box sx={{ width: '100%', minHeight: '100vh', p: 0, m: 0, bgcolor: 'background.default', display: "flex", justifyContent: "center", alignItems: 'center' }}>
            <Paper sx={{ width: '100%', minHeight: '100vh', p: { xs: 2, sm: 4 }, m: 0, borderRadius: 0, boxShadow: 'none', bgcolor: 'background.paper' }}>
                <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', textAlign: 'center' }}>Thông tin cá nhân</Typography>
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
                        gridTemplateColumns: "2fr 2fr"
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
                    <TextField label="Vai trò" value={profile.role} style={{ width: "100%" }} InputProps={{ readOnly: true }} sx={{ mb: 2 }} onChange={(e) => setProfile({ ...profile, role: e.target.value })} />
                    <div></div>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, width: '100%' }}>
                        <Button variant="contained" type='submit' disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default Profile; 