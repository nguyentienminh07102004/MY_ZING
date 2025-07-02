import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createTag, getAllTags } from '../apis/TagService';
import type { TagCreatedRequest, TagResponse } from '../types/Tag';

const PAGE_SIZE = 10;

const AdminTags = () => {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [newTag, setNewTag] = useState<TagCreatedRequest>({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAllTags = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getAllTags(pageNum, PAGE_SIZE);
      setTags(data.content || []);
      setTotalPages(data.page?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTags(page);
  }, [page]);

  const handleOpenModal = () => {
    setNewTag({ name: '', description: '' });
    setError('');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setError('');
  };

  const handleCreateTag = async () => {
    if (!newTag.name.trim()) {
      setError('Tên tag không được để trống');
      return;
    }
    setCreating(true);
    try {
      await createTag(newTag);
      setOpenModal(false);
      setPage(1);
      await fetchAllTags(1);
    } catch (e) {
      setError('Tạo tag thất bại');
    } finally {
      setCreating(false);
    }
  };

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  return (
    <Box sx={{ p: 3, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom align="center">Quản lý Tag</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, width: '100%', maxWidth: 900 }}>
        <Button variant="contained" color="primary" onClick={handleOpenModal}>Thêm tag</Button>
      </Box>
      <Paper sx={{ mt: 2, overflowX: 'auto', width: '100%', maxWidth: 900 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Tên tag</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tags.map(tag => (
                    <TableRow key={tag.id}>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>{tag.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                shape="rounded"
              />
            </Box>
          </>
        )}
      </Paper>
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
        <DialogTitle>Thêm tag mới</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Tên tag"
            value={newTag.name}
            onChange={e => setNewTag({ ...newTag, name: e.target.value })}
            fullWidth
            required
            error={!!error && !newTag.name.trim()}
            helperText={!!error && !newTag.name.trim() ? error : ''}
          />
          <TextField
            label="Mô tả"
            value={newTag.description}
            onChange={e => setNewTag({ ...newTag, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} disabled={creating}>Hủy</Button>
          <Button onClick={handleCreateTag} variant="contained" disabled={creating}>{creating ? 'Đang tạo...' : 'Tạo'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTags; 