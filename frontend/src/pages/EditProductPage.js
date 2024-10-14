import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useEditProductMutation,
  useGetProductByIdQuery,
  useEditProductImageMutation,
} from "../redux-slices/products_api";
import {
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Input,
} from "@mui/material";

const EditProductPage = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [cares, setCares] = useState("");
  const [stockItems, setStockItems] = useState("");
  const [description, setDescription] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const [editProduct, { isLoading: loadingEdit }] = useEditProductMutation();
  const [editProductImage] = useEditProductImageMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCares(product.cares);
      setStockItems(product.stockItems);
      setDescription(product.description);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const editedProduct = {
      productId,
      name,
      price,
      image,
      cares,
      stockItems,
      description,
    };

    const result = await editProduct(editedProduct);
    if (result.error) {
      setSnackbarMessage(
        result.error.data.message || "Error al actualizar el producto"
      );
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    } else {
      setSnackbarMessage("Producto actualizado correctamente");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      navigate("/admin/allproducts");
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await editProductImage(formData).unwrap();
      setSnackbarMessage(res.message);
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setImage(res.image);
    } catch (error) {
      setSnackbarMessage(error?.data?.message || error.error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ mt: 2, mx: "auto", maxWidth: "600px" }}>
      <Link to="/admin/allproducts" style={{ textDecoration: "none" }}>
        <Button variant="outlined" sx={{ mb: 2 }}>
          Volver atrás
        </Button>
      </Link>

      <Typography variant="h5" component="h1" sx={{ mt: 4 }} gutterBottom>
        Editar producto
      </Typography>

      {loadingEdit && <CircularProgress />}

      {isLoading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">
          {error?.data?.message || "Error al cargar el producto"}
        </Alert>
      ) : (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Nombre del producto"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Precio del producto"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Box sx={{ my: 2 }}>
            <Typography variant="body3">Imagen</Typography>
            <Input
              type="text"
              fullWidth
              placeholder="Introduce la URL de la imagen"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Input type="file" onChange={handleFileUpload} />
          </Box>

          <TextField
            margin="normal"
            fullWidth
            label="Stock disponible"
            type="number"
            value={stockItems}
            onChange={(e) => setStockItems(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Descripción del producto"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
              />
                        <TextField
            margin="normal"
            fullWidth
                label="Cuidados"
                multiline
                rows={3}
            value={cares}
            onChange={(e) => setCares(e.target.value)}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Actualizar
          </Button>
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditProductPage;