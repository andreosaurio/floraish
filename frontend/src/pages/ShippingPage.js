import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Box } from "@mui/material";
import { shippingAddressData } from "../redux-slices/shoppingCart";

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(shippingAddressData({ address, city, postalCode, country }));
    navigate("/purchases");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ maxWidth: "600px", margin: "auto", padding: "20px" }}
    >
      <Typography variant="h5">
        Dirección de envío
      </Typography>

      <Box my={2}>
        <TextField
          fullWidth
          label="Dirección"
          variant="outlined"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          label="Ciudad"
          variant="outlined"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          label="Código Postal"
          variant="outlined"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          required
        />
      </Box>

      <Box my={2}>
        <TextField
          fullWidth
          label="País"
          variant="outlined"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
      >
        Continuar
      </Button>
    </Box>
  );
};

export default ShippingPage;