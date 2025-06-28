import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Stack, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip, Box, FormHelperText, IconButton, Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { instance } from '../apis/instance';
import type { SongResponse } from '../types/Song';
import type { SingerResponse } from '../types/Singer';
import type { TagResponse } from '../types/Tag';

interface SongEditModalProps {
  open: boolean;
  onClose: () => void;
  song: SongResponse | null;
  onSave: (updatedSong: SongResponse) => void;
}

const SongEditModal = ({ open, onClose, song, onSave }: SongEditModalProps) => {
  const [name, setName] = useState(song?.name || '');
  const [description, setDescription] = useState(song?.description || '');
  const [selectedSingers, setSelectedSingers] = useState<string[]>(song?.singers.map(s => s.id) || []);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(song?.imageUrl || null);
  const [singers, setSingers] = useState<SingerResponse[]>([]);
  const [tags, setTags] = useState<string[]>([]);

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({ name: false, singers: false });

  // Fetch singers & tags
  useEffect(() => {
    const fetchSingers = async () => {
      const res = await instance.get('/public/singers');
      setSingers(res.data.content || []);
    };
    const fetchTags = async () => {
      const res = await instance.get('/public/tags');
      setTags((res.data.content || []).map((t: TagResponse) => t.name));
    };
    fetchSingers();
    fetchTags();
  }, []);

  // Reset fields when open or song changes
  useEffect(() => {
    setName(song?.name || '');
    setDescription(song?.description || '');
    setSelectedSingers(song?.singers.map(s => s.id) || []);
    setImagePreview(song?.imageUrl || null);
    setAudioFile(null);
    setImageFile(null);
    // Không reset tag vì song không có trường tags, cần backend trả về nếu muốn
  }, [song, open]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };
  const handleRemoveAudio = () => setAudioFile(null);

  const handleSave = async () => {
    if (!song) return;
    if (!name.trim() || selectedSingers.length === 0) {
      setErrors({ name: !name.trim(), singers: selectedSingers.length === 0 });
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('data', new Blob([JSON.stringify({
        name,
        description,
        singers: selectedSingers,
        tags: selectedTags,
      })], { type: 'application/json' }));
      if (audioFile) formData.append('file', audioFile);
      if (imageFile) formData.append('image', imageFile);
      const res = await instance.put(`/auth/songs/${song.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      onSave(res.data);
      onClose();
    } catch (e) {
      alert('Cập nhật thất bại!');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Chỉnh sửa thông tin bài hát
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Tên bài hát"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: false })); }}
            fullWidth
            required
            error={errors.name}
            helperText={errors.name ? 'Vui lòng nhập tên bài hát' : ''}
          />
          <TextField
            label="Mô tả"
            value={description}
            onChange={e => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <FormControl fullWidth error={errors.singers} required>
            <InputLabel id="singers-label">Ca sĩ</InputLabel>
            <Select
              labelId="singers-label"
              multiple
              value={selectedSingers}
              onChange={e => setSelectedSingers(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map(id => {
                    const singer = singers.find(s => s.id === id);
                    return <Chip key={id} label={singer?.fullName || id} />;
                  })}
                </Box>
              )}
            >
              {singers.map(singer => (
                <MenuItem key={singer.id} value={singer.id}>{singer.fullName}</MenuItem>
              ))}
            </Select>
            {errors.singers && <FormHelperText>Vui lòng chọn ít nhất một ca sĩ</FormHelperText>}
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={selectedTags}
              onChange={e => setSelectedTags(typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value as string[])}
              renderValue={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map(tag => <Chip key={tag} label={tag} />)}
                </Box>
              )}
            >
              {tags.map(tag => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              File âm thanh
            </Typography>
            {audioFile ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" noWrap>{audioFile.name}</Typography>
                <IconButton size="small" onClick={handleRemoveAudio} color="error"><DeleteIcon /></IconButton>
              </Box>
            ) : (
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth>
                Chọn file âm thanh
                <input type="file" hidden accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} />
              </Button>
            )}
          </Box>
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Ảnh bìa
            </Typography>
            {imagePreview ? (
              <Box sx={{ position: 'relative' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }} />
                <IconButton size="small" onClick={handleRemoveImage} sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', color: 'white' }}><DeleteIcon /></IconButton>
              </Box>
            ) : (
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} fullWidth>
                Chọn ảnh bìa
                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
              </Button>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>Huỷ</Button>
        <Button onClick={handleSave} variant="contained" disabled={uploading}>
          {uploading ? <CircularProgress size={20} /> : 'Lưu'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SongEditModal; 