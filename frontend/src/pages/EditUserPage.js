import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import {
  useGetUsersIdQuery,
  useUpdateUserMutation,
} from '../redux-slices/users_api';

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUsersIdQuery(userId);

  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({ userId, name, email, isAdmin });
      setSnackbarSeverity('success');
      setSnackbarMessage('Usuario actualizado');
      setOpenSnackbar(true);
      refetch();
      navigate('/admin/allusers');
    } catch (err) {
      setSnackbarSeverity('error');
      setSnackbarMessage(err?.data?.message || err.error);
      setOpenSnackbar(true);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
    }
  }, [user]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth='sm'>
      <Button component={Link} to='/admin/allusers' variant='outlined' sx={{ mb: 3 }}>
        Volver atrás
      </Button>
      <Typography sx={{ mt: 4}} variant='h5' gutterBottom>
        Actualizar usuario
      </Typography>
      {loadingUpdate && <CircularProgress />}
      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity='error'>
          {error?.data?.message || error.error}
        </Alert>
      ) : (
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label='Name'
            variant='outlined'
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label='Email Address'
            variant='outlined'
            type='email'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
            }
            label={
              <Typography variant="body3">
                Usuario administrador
              </Typography>
            }
          />
          <Button type='submit' variant='contained' color='primary'>
            {loadingUpdate ? <CircularProgress size={24} /> : 'Actualizar'}
          </Button>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserEditScreen;