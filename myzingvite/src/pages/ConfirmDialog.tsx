import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText?: string;
  confirmColor?: 'primary' | 'error' | 'inherit' | 'secondary' | 'success' | 'info' | 'warning';
}

const ConfirmDialog = ({ open, title, content, onClose, onConfirm, confirmText = 'Xoá', confirmColor = 'error' }: ConfirmDialogProps) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
    {title && <DialogTitle>{title}</DialogTitle>}
    {content && <DialogContent><Typography>{content}</Typography></DialogContent>}
    <DialogActions>
      <Button onClick={onClose} color="inherit">Huỷ</Button>
      <Button onClick={() => { onConfirm(); onClose(); }} color={confirmColor} variant="contained">{confirmText}</Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog; 