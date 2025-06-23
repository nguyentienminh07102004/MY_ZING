import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography
} from '@mui/material';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { instance } from '../apis/instance';
import type { SingerResponse } from '../types/Singer';
import type { TagResponse } from '../types/Tag';
import CircularProgress from '@mui/material/CircularProgress';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
}

const UploadModal = ({ open, onClose }: UploadModalProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSingers, setSelectedSingers] = useState<string[]>([]);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    name: false,
    singers: false,
    audioFile: false
  });
  const [tags, setTags] = useState<string[]>([]);
  const [singers, setSingers] = useState<SingerResponse[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tagPage, setTagPage] = useState(1);
  const [hasMoreTags, setHasMoreTags] = useState(true);
  const [loadingTags, setLoadingTags] = useState(false);
  const token = Cookies.get('token');
  const [uploading, setUploading] = useState(false);

  const fetchSingers = async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await instance.get('/public/singers', {
        params: {
          page: pageNum
        }
      });
      const newSingers = response.data.content;
      setSingers(prev => pageNum === 1 ? newSingers : [...prev, ...newSingers]);
      setHasMore(newSingers.length > 0);
    } catch (error) {
      console.error('Error fetching singers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async (pageNum: number) => {
    try {
      setLoadingTags(true);
      const response = await instance.get('/public/tags', {
        params: {
          page: pageNum
        }
      });
      const newTags: TagResponse[] = response.data.content;
      const tagNames: string[] = newTags.map(tag => tag.name);
      setTags(prev => pageNum === 1 ? tagNames : [...prev, ...tagNames]);
      setHasMoreTags(newTags.length > 0);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    fetchSingers(page);
  }, [page]);

  useEffect(() => {
    fetchTags(tagPage);
  }, [tagPage])

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const handleTagScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loadingTags && hasMoreTags) {
      setTagPage(prev => prev + 1);
    }
  };

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
      onScroll: handleScroll
    },
  };

  const TagMenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
      },
      onScroll: handleTagScroll
    },
  };

  const validateForm = () => {
    const newErrors = {
      name: !name.trim(),
      singers: selectedSingers.length === 0,
      audioFile: !audioFile
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleTagChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedTags(typeof value === 'string' ? value.split(',') : value);
  };

  const handleSingerChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedSingers(typeof value === 'string' ? value.split(',') : value);
    setErrors(prev => ({ ...prev, singers: false }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleRemoveAudio = () => {
    setAudioFile(null);
    setErrors(prev => ({ ...prev, audioFile: true }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify({
      name,
      description,
      tags: selectedTags,
      singers: selectedSingers,
    })], {
      type: "application/json"
    }));
    if (audioFile) formData.append("file", audioFile);
    if (imageFile) formData.append("image", imageFile);
    try {
      await instance.post('/auth/songs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      onClose();
      // Reset form
      setName('');
      setDescription('');
      setSelectedTags([]);
      setSelectedSingers([]);
      setAudioFile(null);
      setImageFile(null);
      setImagePreview(null);
      setErrors({
        name: false,
        singers: false,
        audioFile: false
      });
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Tải Lên Bài Hát Mới
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Tên bài hát"
            fullWidth
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors(prev => ({ ...prev, name: false }));
            }}
            error={errors.name}
            helperText={errors.name ? "Vui lòng nhập tên bài hát" : ""}
          />
          <TextField
            label="Mô tả"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <FormControl fullWidth error={errors.singers} required>
            <InputLabel id="singers-label">Ca sĩ</InputLabel>
            <Select
              labelId="singers-label"
              multiple
              value={selectedSingers}
              onChange={handleSingerChange}
              MenuProps={MenuProps}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {singers.map((singer) => (
                <MenuItem key={singer.id} value={singer.id}>
                  {singer.fullName}
                </MenuItem>
              ))}
              {loading && (
                <MenuItem disabled>
                  <Box sx={{ width: '100%', textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Đang tải...
                    </Typography>
                  </Box>
                </MenuItem>
              )}
              {!hasMore && singers.length > 0 && (
                <MenuItem disabled>
                  <Box sx={{ width: '100%', textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Không còn dữ liệu
                    </Typography>
                  </Box>
                </MenuItem>
              )}
            </Select>
            {errors.singers && (
              <FormHelperText>Vui lòng chọn ít nhất một ca sĩ</FormHelperText>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="tags-label">Tags</InputLabel>
            <Select
              labelId="tags-label"
              multiple
              value={selectedTags}
              onChange={handleTagChange}
              MenuProps={TagMenuProps}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {tags.map((tag) => (
                <MenuItem key={tag} value={tag}>
                  {tag}
                </MenuItem>
              ))}
              {loadingTags && (
                <MenuItem disabled>
                  <Box sx={{ width: '100%', textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Đang tải...
                    </Typography>
                  </Box>
                </MenuItem>
              )}
              {!hasMoreTags && tags.length > 0 && (
                <MenuItem disabled>
                  <Box sx={{ width: '100%', textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Không còn dữ liệu
                    </Typography>
                  </Box>
                </MenuItem>
              )}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              File âm thanh <Typography component="span" color="error">*</Typography>
            </Typography>
            {audioFile ? (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: 'background.default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" noWrap>
                  {audioFile.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={handleRemoveAudio}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </Paper>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{
                  borderColor: errors.audioFile ? 'error.main' : undefined,
                  '&:hover': {
                    borderColor: errors.audioFile ? 'error.main' : undefined,
                  }
                }}
              >
                Chọn file âm thanh
                <input
                  type="file"
                  hidden
                  accept="audio/*"
                  onChange={(e) => {
                    setAudioFile(e.target.files?.[0] || null);
                    setErrors(prev => ({ ...prev, audioFile: false }));
                  }}
                />
              </Button>
            )}
            {errors.audioFile && (
              <FormHelperText error sx={{ mt: 1 }}>
                Vui lòng chọn file âm thanh
              </FormHelperText>
            )}
          </Box>

          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Ảnh bìa
            </Typography>
            {imagePreview ? (
              <Box sx={{ position: 'relative' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 8
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveImage}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.7)',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                fullWidth
              >
                Chọn ảnh bìa
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={uploading}>Hủy</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={uploading}
          startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {uploading ? 'Đang tải lên...' : 'Tải lên'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UploadModal; 