import React, { useCallback } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  Box,
  Divider,
  Link,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { addToCart, removeFromCart } from "../redux-slices/shoppingCart";
import { colors } from "../styles/theme"; 

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const handleRemoveFromCart = useCallback(
    (id) => {
      dispatch(removeFromCart(id));
    },
    [dispatch]
  );

  const handleUpdateCartQty = useCallback(
    (product, qty) => {
      dispatch(addToCart({ ...product, qty }));
    },
    [dispatch]
  );

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const handleCheckout = () => {
    navigate("/login?redirect=/shipping");
  };

  if (cartItems.length === 0) {
    return (
      <Container>
        <Typography variant="h4" sx={{ mb: 3 }}>
          Carrito
        </Typography>
        <Typography variant="body5">
          Aún no has añadido nada al carrito.{" "}
          <Link component={RouterLink} to="/">
            Regresa a la página principal
          </Link>
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Carrito
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cartItems.map(({ _id, image, name, price, qty, stockItems }) => (
            <Card key={_id} sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <CardMedia component="img" image={image} alt={name} />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <CardContent>
                    <Typography variant="body1">
                      <Link component={RouterLink} to={`/product/${_id}`}>
                        {name}
                      </Link>
                    </Typography>
                  </CardContent>
                </Grid>

                <Grid item xs={6} sm={2}>
                  <CardContent>
                    <Typography variant="body3">{price} €</Typography>
                  </CardContent>
                </Grid>

                <Grid item xs={6} sm={4}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 120,
                          "& .MuiOutlinedInput-root": { border: "none" },
                        }}
                      >
                        <Select
                          labelId="qty-label"
                          value={qty}
                          onChange={(e) =>
                            handleUpdateCartQty(
                              { _id, image, name, price, stockItems },
                              Number(e.target.value)
                            )
                          }
                          sx={{ color: colors.verdeOscuro }}
                        >
                          {[...Array(stockItems).keys()].map((x) => (
                            <MenuItem
                              key={x + 1}
                              value={x + 1}
                              sx={{ color: colors.verdeOscuro }} 
                            >
                              {x + 1}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <IconButton
                        onClick={() => handleRemoveFromCart(_id)}
                        sx={{
                          color: "warning.main",
                          ml: 1,
                          "&:hover": {
                            backgroundColor: "warning.main.light",
                          },
                        }}
                      >
                        <DeleteIcon sx={{ color: colors.verdePlata }} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          ))}
        </Grid>

        {/* Resumen del carrito */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Resumen del Pedido</Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body5">
                Total ({totalItems} productos): {totalPrice.toFixed(2)} €
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleCheckout}
              >
                TRAMITAR COMPRA
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
