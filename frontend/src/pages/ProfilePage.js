import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../redux-slices/users_api";
import { setCredentials } from "../redux-slices/authorization";
import {
  Grid,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useGetMyPurchasesQuery } from "../redux-slices/purchase";
import { formatDate } from "../helpers/dateHelper";

const ProfilePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authorization);
  const [profileUpdate, { isLoading: loadingProfileUpdate }] =
    useProfileMutation();

  const { data: purchases, isLoading, error } = useGetMyPurchasesQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setSnackbarMessage("Las contraseñas no coinciden.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      try {
        const res = await profileUpdate({
          _id: userInfo._id,
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials(res));
        setSnackbarMessage("Datos de perfil actualizados");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
      } catch (error) {
        setSnackbarMessage(error?.data?.message || error.error);
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={3}>
        <Typography variant="h5">Perfil de usuario</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="name"
            label="Nombre"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            id="email"
            label="Dirección de email"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            id="password"
            label="Modificar contraseña"
            type="password"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="my-2"
            disabled={loadingProfileUpdate}
          >
            Actualizar
          </Button>
        </form>
      </Grid>

      <Grid item md={9}>
        <Typography variant="h5">Mis pedidos</Typography>
        {isLoading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error?.data?.message || error.error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Número de pedido</TableCell>
                  <TableCell>Fecha</TableCell>

                  <TableCell>Fecha de pago</TableCell>
                  <TableCell>Importe</TableCell>
                  <TableCell>Fecha de entrega</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase._id}>
                    <TableCell>{purchase._id}</TableCell>
                    <TableCell>{formatDate(purchase.createdAt)}</TableCell>
                    <TableCell>
                      {purchase.hasBeenPaid
                        ? formatDate(purchase.paymentDate)
                        : "Pendiente"}
                    </TableCell>
                    <TableCell>{purchase.totalAmount}€</TableCell>
                    <TableCell>
                      {purchase.deliveryCompleted
                        ? formatDate(purchase.deliveryDate)
                        : "Pendiente"}
                    </TableCell>
                    <TableCell>
                      <Button
                        component={RouterLink}
                        to={`/purchases/${purchase._id}`}
                        variant="contained"
                        color="primary"
                      >
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ProfilePage;
