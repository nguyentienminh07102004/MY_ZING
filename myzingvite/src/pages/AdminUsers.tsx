import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { Avatar, Box, Button, CircularProgress, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { deleteUserByEmail, getAllUsers, updateUserRole } from '../apis/UserService';
import type { UserResponse } from '../types/User';
import ConfirmDialog from './ConfirmDialog';

const AdminUsers = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteEmail, setPendingDeleteEmail] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'delete' | 'restore'>('delete');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data.content || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = (email: string) => {
    setPendingDeleteEmail(email);
    setPendingAction('delete');
    setConfirmOpen(true);
  };

  const handleRestore = (email: string) => {
    setPendingDeleteEmail(email);
    setPendingAction('restore');
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteEmail) return;
    setUpdating(pendingDeleteEmail);
    await deleteUserByEmail(pendingDeleteEmail);
    await fetchUsers();
    setUpdating(null);
    setConfirmOpen(false);
    setPendingDeleteEmail(null);
  };

  const handleRoleChange = async (email: string, role: 'USER' | 'ADMIN') => {
    setUpdating(email);
    await updateUserRole(email, role);
    await fetchUsers();
    setUpdating(null);
  };

  const confirmTitle = pendingAction === 'delete' ? 'Xác nhận xoá user' : 'Xác nhận khôi phục user';
  const confirmContent = pendingAction === 'delete'
    ? 'Bạn có chắc chắn muốn xoá user này?'
    : 'Bạn có chắc chắn muốn khôi phục user này?';
  return (
    <Box sx={{ p: 3, minHeight: '80vh' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom align="center">Quản lý người dùng</Typography>
      <Paper sx={{ mt: 2, overflowX: 'auto', width: '100%', maxWidth: 900, mx: 'auto' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Avatar</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Họ tên</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Vai trò</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Hành động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar
                        src={user.picture}
                        alt={`${user.firstName} ${user.lastName}`}
                        sx={{ width: 40, height: 40 }}
                      >
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.role}
                        onChange={e => handleRoleChange(user.email, e.target.value as 'USER' | 'ADMIN')}
                        size="small"
                        disabled={updating === user.email || user.deleted}
                        startAdornment={user.role === 'ADMIN' ? <AdminPanelSettingsIcon color="primary" sx={{ mr: 1 }} /> : <PersonIcon sx={{ mr: 1 }} />}
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value="USER">USER</MenuItem>
                        <MenuItem value="ADMIN">ADMIN</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.deleted ? (
                        <Button
                          variant="outlined"
                          color="inherit" size="small"
                          onClick={() => handleRestore(user.email)}
                          disabled={updating === user.email}>Khôi phục</Button>
                      ) : (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(user.email)}
                          disabled={updating === user.email}
                        >
                          Xoá
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
      <ConfirmDialog
        open={confirmOpen}
        title={confirmTitle}
        content={confirmContent}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        confirmText={pendingAction === 'delete' ? 'Xoá' : 'Khôi phục'}
        confirmColor={pendingAction === 'delete' ? 'error' : 'primary'}
      />
    </Box>
  );
};

export default AdminUsers; 