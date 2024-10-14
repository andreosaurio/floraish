import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { formatDate } from "../helpers/dateHelper";
import {
  useGetPurchasesQuery,
  useDeliverPurchaseMutation,
} from "../redux-slices/purchase";

const AllPurchasesPage = () => {
  const { data: purchases, isLoading, error } = useGetPurchasesQuery();
  const [deliverPurchase] = useDeliverPurchaseMutation();

  const [sortedPurchases, setSortedPurchases] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (purchases) {
      const sorted = [...purchases].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setSortedPurchases(sorted);
    }
  }, [purchases]);

  const handleDeliver = async (purchaseId) => {
    const updatedPurchases = sortedPurchases.map((purchase) =>
      purchase._id === purchaseId
        ? {
            ...purchase,
            deliveryCompleted: true,
            deliveryDate: new Date().toISOString(),
          }
        : purchase
    );

    setSortedPurchases(updatedPurchases);

    try {
      await deliverPurchase(purchaseId).unwrap(); 
      setSnackbarMessage("La entrega ha sido marcada como completada.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error("Error al marcar como entregado:", err);
      setSnackbarMessage("Error al marcar como entregado. Inténtalo de nuevo.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);

      setSortedPurchases(sortedPurchases);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Pedidos
      </Typography>

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número de pedido</TableCell>
                <TableCell>Usuario</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Importe</TableCell>
                <TableCell>Fecha de pago</TableCell>
                <TableCell>Fecha de entrega</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedPurchases.map((purchase) => (
                <TableRow key={purchase._id}>
                  <TableCell>{purchase._id}</TableCell>
                  <TableCell>{purchase.user && purchase.user.name}</TableCell>
                  <TableCell>{formatDate(purchase.createdAt)}</TableCell>
                  <TableCell>{purchase.totalAmount}€</TableCell>
                  <TableCell>
                    {purchase.hasBeenPaid
                      ? formatDate(purchase.paymentDate)
                      : "Pendiente"}
                  </TableCell>
                  <TableCell>
                    {purchase.deliveryCompleted
                      ? formatDate(purchase.deliveryDate)
                      : "Pendiente"}
                  </TableCell>
                  <TableCell>
                    {!purchase.deliveryCompleted ? (
                      purchase.hasBeenPaid ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleDeliver(purchase._id)}
                          style={{ marginLeft: "10px" }}
                        >
                          Confirmar entrega
                        </Button>
                      ) : (
                        <Box sx={{ textAlign: "center", width: "100%" }}>
                          {" "}
                          <Typography variant="caption" color="textSecondary">
                            Pendiente de pago
                          </Typography>
                        </Box>
                      )
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      component={Link}
                      to={`/purchases/${purchase._id}`}
                    >
                      Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AllPurchasesPage;
