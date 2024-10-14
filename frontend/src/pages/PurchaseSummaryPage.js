import React, { useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
  Link,
} from "@mui/material";
import { useGetPurchaseDetailsQuery } from "../redux-slices/purchase";
import { formatDate } from "../helpers/dateHelper";
import StripePaymentForm from "../components/StripePaymentForm";
import { colors } from "../styles/theme";

const PurchaseSummaryPage = () => {
  const { id: purchaseId } = useParams();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const {
    data: purchase,
    refetch,
    isLoading,
    error,
  } = useGetPurchaseDetailsQuery(purchaseId);

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography variant="body1">Error: {error.message}</Typography>;

  const handleShowPaymentForm = () => {
    setShowPaymentForm(true);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Pedido Nº: {purchase._id}
      </Typography>
      <Grid container spacing={2}>
        {/* Detalles de compra */}
        <Grid item md={8}>
          <Card>
            <CardContent>
              <Typography variant="h5">Detalles</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        Nombre:
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        {purchase.user.name}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        Email:
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        {purchase.user.email}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        Dirección:
                      </Typography>
                    }
                    secondary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        {`${purchase.shippingAddress.address}, ${purchase.shippingAddress.city} ${purchase.shippingAddress.postalCode}`}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        {purchase.deliveryCompleted
                          ? "Entregado el:"
                          : "Pendiente de recibir"}
                      </Typography>
                    }
                    secondary={
                      purchase.deliveryCompleted ? (
                        <Typography sx={{ color: colors.verdeOscuro }}>
                          {formatDate(purchase.deliveryDate)}
                        </Typography>
                      ) : (
                        ""
                      )
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography sx={{ color: colors.verdeOscuro }}>
                        {purchase.hasBeenPaid
                          ? "Pagado el:"
                          : "Pendiente de pago"}
                      </Typography>
                    }
                    secondary={
                      purchase.hasBeenPaid ? (
                        <Typography sx={{ color: colors.verdeOscuro }}>
                          {formatDate(purchase.paymentDate)}
                        </Typography>
                      ) : (
                        ""
                      )
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Artículos del pedido */}
          <Card sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h5">Artículos del pedido</Typography>
              <List>
                {purchase.purchasedItems.map((item, index) => (
                  <ListItem key={index}>
                    <Grid container alignItems="center">
                      <Grid item md={2}>
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{ width: "100%" }}
                        />
                      </Grid>
                      <Grid item md={6} sx={{ marginLeft: 2 }}>
                        <Link
                          component={RouterLink}
                          to={`/product/${item.product}`}
                        >
                          {item.name}
                        </Link>
                        <Typography
                          sx={{ color: colors.verdeOscuro, marginTop: 1 }}
                        >
                          {item.quantity} x {item.unitPrice}€ ={" "}
                          {item.quantity * item.unitPrice}€
                        </Typography>
                      </Grid>
                    </Grid>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Resumen del pedido */}
        <Grid item md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Resumen del pedido</Typography>
              <Divider sx={{ margin: "16px 0" }} />
              <Grid container justifyContent="space-between">
                <Typography sx={{ color: colors.verdeOscuro }}>
                  Productos
                </Typography>
                <Typography sx={{ color: colors.verdeOscuro }}>
                  {purchase.unitPrice}€
                </Typography>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography sx={{ color: colors.verdeOscuro }}>
                  Envío
                </Typography>
                <Typography sx={{ color: colors.verdeOscuro }}>
                  {purchase.shippingRate}€
                </Typography>
              </Grid>
              <Grid container justifyContent="space-between">
                <Typography sx={{ color: colors.verdeOscuro }}>
                  Total
                </Typography>
                <Typography sx={{ color: colors.verdeOscuro }}>
                  {purchase.totalAmount}€
                </Typography>
              </Grid>

              {/* Botón de completar pago */}
              {!purchase.hasBeenPaid && (
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={handleShowPaymentForm}
                  sx={{ marginTop: 2 }}
                >
                  Completar Pago
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Mostrar el formulario de pago si se activa */}
          {showPaymentForm && (
            <Card sx={{ marginTop: 2 }}>
              <CardContent>
                <Typography variant="h5">Formulario de Pago</Typography>
                <StripePaymentForm purchaseId={purchaseId} refetch={refetch} />
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default PurchaseSummaryPage;
