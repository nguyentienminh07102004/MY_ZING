import { DeleteSweepOutlined } from '@mui/icons-material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Input, Pagination, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { createTag, deleteTagService, getAllTags, updateTag } from '../apis/TagService';
import type { TagCreatedRequest, TagResponse } from '../types/Tag';

const PAGE_SIZE = 10;

const AdminTags = () => {
  const [tags, setTags] = useState<TagResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newTag, setNewTag] = useState<TagCreatedRequest>({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKey, setSearchKey] = useState('');
  const [reload, setReload] = useState(false);
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [tagsSelected, setTagSelected] = useState<TagResponse>({ id: '', name: '', description: '' });
  const [openUpdateModel, setOpenUpdateModel] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchAllTags = async (pageNum = 1) => {
    setLoading(true);
    try {
      const data = await getAllTags(pageNum, PAGE_SIZE, searchKey);
      setTags(data.content || []);
      setTotalPages(data.page?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTags(page);
  }, [page, searchKey, reload]);

  const handleOpenModal = () => {
    setNewTag({ name: '', description: '' });
    setError('');
    setOpenCreateModal(true);
  };

  const handleCloseModal = () => {
    setOpenCreateModal(false);
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
      setOpenCreateModal(false);
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

  const searchTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === 'Enter') {
      const searchKey = (event.target as HTMLInputElement).value;
      setSearchKey(searchKey);
    }
  }

  const handleDeleteTags = async () => {
    if (!tagsSelected) return;
    await deleteTagService(tagsSelected.id);
    setReload(!reload);
  }

  const handleUpdateTag = async () => {
    try {
      setUpdating(true);
      await updateTag({ ...tagsSelected });
      setReload(!reload);
    } catch {

    } finally {
      setUpdating(false);
    }
  }

  return (
    <Box sx={{ p: 3, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom align="center">Quản lý Tag</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mb: 2, width: '100%', maxWidth: 900 }}>
        <Input onKeyDown={searchTags} />
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
                    <TableCell colSpan={2}>Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tags.map(tag => (
                    <TableRow key={tag.id} style={{ cursor: 'pointer' }}>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell>{tag.description}</TableCell>
                      <TableCell onClick={() => { setTagSelected(tag); setOpenUpdateModel(true); }}><BorderColorRoundedIcon /></TableCell>
                      <TableCell onClick={() => {
                        setTagSelected(tag);
                        setOpenConfirmDelete(true);
                      }}><DeleteSweepOutlined /></TableCell>
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
      <Dialog open={openCreateModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
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
          <Button onClick={handleCreateTag} variant="contained" disabled={creating}>{creating ? 'Đang lưu...' : 'Lưu'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openUpdateModel} onClose={() => setOpenUpdateModel(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Sửa tag</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Tên tag"
            value={tagsSelected?.name}
            onChange={e => setTagSelected({ ...tagsSelected, name: e.target.value })}
            fullWidth
            required
            error={!!error && !tagsSelected?.name?.trim()}
            helperText={!!error && !newTag.name.trim() ? error : ''}
          />
          <TextField
            label="Mô tả"
            value={tagsSelected?.description}
            onChange={e => setTagSelected({ ...tagsSelected, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateModel(false)} disabled={updating}>Hủy</Button>
          <Button onClick={handleUpdateTag} variant="contained" disabled={updating}>{updating ? 'Đang lưu...' : 'Lưu'}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openConfirmDelete}
        onClose={() => setOpenConfirmDelete(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn chắc chắn muốn xoá?"}
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenConfirmDelete(false)}>Huỷ</Button>
          <Button onClick={handleDeleteTags} autoFocus>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminTags; 