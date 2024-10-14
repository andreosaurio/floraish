import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  List,
  ListItem,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import { useCreatePurchaseMutation } from "../redux-slices/purchase";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import StripePaymentForm from "../components/StripePaymentForm";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PurchasePage = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);

  const [createPurchase, { isLoading, error }] = useCreatePurchaseMutation();
  const [openError, setOpenError] = useState(false);
  const [purchaseId, setPurchaseId] = useState(null);

  useEffect(() => {
    if (!cart.shippingAddress?.address) {
      navigate("/shipping");
    }
  }, [cart.shippingAddress?.address, navigate]);

  const handlePurchase = async () => {
    try {
      // Crear la compra
      const res = await createPurchase({
        purchasedItems: cart.cartItems.map((item) => ({
          name: item.name,
          quantity: item.qty,
          image: item.image,
          product: item._id,
          unitPrice: item.price,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        unitPrice: cart.itemsPrice,
        shippingRate: cart.shippingPrice,
        totalAmount: cart.totalPrice,
      }).unwrap();

      setPurchaseId(res._id);
    } catch (error) {
      console.log(error);
      setOpenError(true);
    }
  };

  const handleCloseError = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenError(false);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        {/* Sección izquierda (detalles de envío y productos) */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Envío</Typography>
            <Typography variant="body2">
              {cart.shippingAddress.address}
            </Typography>
            <Typography variant="body2">
              {cart.shippingAddress.city}, {cart.shippingAddress.postalCode}
            </Typography>
            <Typography variant="body2">
              {cart.shippingAddress.country}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6">Productos</Typography>
            {cart.cartItems.length === 0 ? (
              <Typography>Tu carrito de compra está vacío</Typography>
            ) : (
              <List>
                {cart.cartItems.map((item, index) => (
                  <ListItem key={index}>
                    <Grid container spacing={2}>
                      <Grid item xs={2}>
                        {/* Imagen del producto */}
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%", borderRadius: "8px" }}
                        />
                      </Grid>
                      <Grid item xs={10}>
                        {/* Nombre del producto y enlace */}
                        <Typography variant="body2">
                          <Link
                            to={`/product/${item._id}`}
                            style={{ textDecoration: "none", color: "inherit" }}
                          >
                            {item.name}
                          </Link>
                        </Typography>

                        {/* Cálculo de cantidad por precio */}
                        <Typography variant="body2" color="textSecondary">
                          {item.qty} x {item.price}€ ={" "}
                          {(Number(item.qty) * Number(item.price)).toFixed(2)}€
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Sección derecha (resumen de compra) */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6">Resumen de la compra</Typography>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography style={{ color: "#3a7658" }}>
                      Artículos:
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ color: "#3a7658" }}>
                      {cart.itemsPrice}€
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography style={{ color: "#3a7658" }}>Envío:</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ color: "#3a7658" }}>
                      {cart.shippingPrice}€
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography style={{ color: "#3a7658" }}>
                      <strong>Total:</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography style={{ color: "#3a7658" }}>
                      <strong>{cart.totalPrice}€</strong>
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              {error && (
                <ListItem>
                  <Snackbar
                    open={openError}
                    autoHideDuration={6000}
                    onClose={handleCloseError}
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                  >
                    <Alert
                      onClose={handleCloseError}
                      severity="error"
                      sx={{ width: "100%" }}
                    >
                      {error?.data?.message ||
                        error?.error ||
                        "Error al realizar la compra"}
                    </Alert>
                  </Snackbar>
                </ListItem>
              )}

              <ListItem>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={cart.cartItems.length === 0}
                  onClick={handlePurchase}
                >
                  Finalizar compra
                </Button>
              </ListItem>

              {isLoading && (
                <ListItem>
                  <CircularProgress />
                </ListItem>
              )}
            </List>
          </Paper>

          {/* Formulario de Stripe después de finalizar la compra */}
          {purchaseId && (
            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6">Realizar pago</Typography>
              <Elements stripe={stripePromise}>
                <StripePaymentForm purchaseId={purchaseId} />
              </Elements>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchasePage;
