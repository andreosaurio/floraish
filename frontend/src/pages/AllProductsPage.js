import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import {
  useGetProductsQuery,
  useCreateNewProductMutation,
  useRemoveProductMutation,
} from "../redux-slices/products_api";
import Paginate from "../components/Pagination";

const AllProductsPage = () => {
  const { pageNumber } = useParams();

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [createNewProduct, { isLoading: createLoading }] =
    useCreateNewProductMutation();
  const [removeProduct, { isLoading: removeLoading }] =
    useRemoveProductMutation();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      try {
        await removeProduct(selectedProduct._id).unwrap();
        refetch();
        setSnackbarMessage("Producto eliminado con éxito");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        handleCloseDialog();
      } catch (error) {
        setSnackbarMessage(
          error?.data?.message || error.error || "Error al eliminar el producto"
        );
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleProductCreate = async () => {
    try {
      await createNewProduct({
        name: "Nuevo producto",
        price: 1,
        image: "url/de/la/imagen",
        cares: "Cuidados",
        stockItems: 100,
        description: "Descripción del producto",
      }).unwrap();
      setSnackbarMessage("Producto estándar creado. Edítalo con la información.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      refetch();
    } catch (error) {
      setSnackbarMessage(
        error?.data?.message || error.error || "Error al crear el producto"
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item>
          <Typography variant="h4">Lista de productos</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ModeEditIcon />}
            onClick={handleProductCreate}
          >
            Crear nuevo producto
          </Button>
        </Grid>
      </Grid>

      {createLoading && <CircularProgress />}
      {removeLoading && <CircularProgress />}

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      ) : (
        <TableContainer sx={{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>{product._id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.price}€</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/admin/product/${product._id}/update`}
                      startIcon={<ModeEditIcon />}
                    >
                      Editar
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpenDialog(product)}
                      variant="outlined"
                      color="error"
                      size="small"
                      startIcon={<DeleteIcon />}
                      style={{ marginLeft: "8px" }}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </TableContainer>
      )}

      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          Confirmar eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el producto{" "}
            {selectedProduct?.name}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AllProductsPage;