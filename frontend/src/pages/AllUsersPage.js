import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import {
  useGetAllProfilesQuery,
  useDeleteUserMutation,
} from "../redux-slices/users_api";
import { colors } from "../styles/theme";


const UserListScreen = () => {
  const { data: users, refetch, isLoading, error } = useGetAllProfilesQuery();
  const [deleteUser, { isLoading: deleteLoading }] = useDeleteUserMutation();

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  const deleteHandler = async () => {
    try {
      await deleteUser(selectedUserId).unwrap();
      refetch();
      setSnackbarMessage("Usuario eliminado con éxito");
      setSnackbarSeverity("success");
    } catch (err) {
      setSnackbarMessage(err?.data?.message || err.error);
      setSnackbarSeverity("error");
    }
    setOpenSnackbar(true);
    handleCloseDialog();
  };

  // ID del mega administrador (megaAdmin), para que no se pueda eliminar
  const megaAdminId = "66db59e72b5da84efa899d6c";

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Usuarios
      </Typography>

      {deleteLoading && <CircularProgress />}

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Snackbar
          open
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        </Snackbar>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>NOMBRE</TableCell>
                <TableCell>EMAIL</TableCell>
                <TableCell>ADMIN</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${user.email}`}
                      style={{ color: "#8BC3A6" }}
                    >
                      {user.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <CheckIcon style={{ color: colors.verdePastel }} />
                    ) : (
                      <ClearIcon style={{ color: colors.rosaMarron }} />
                    )}
                  </TableCell>
                  <TableCell>
                    {/* Evitar editar/eliminar el megaAdmin */}
                    {user._id !== megaAdminId && (
                      <>
                        <IconButton
                          component={Link}
                          to={`/admin/user/${user._id}/edit`}
                          style={{ marginRight: "10px" }}
                        >
                          <ModeEditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleOpenDialog(user._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal de Confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar este usuario? Esta acción no
            se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={deleteHandler} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setOpenSnackbar(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UserListScreen;
