import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CircularProgress,
  Snackbar,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import { ENDPOINTS } from "../config";
import { emptyCart } from "../redux-slices/shoppingCart";

const StripePaymentForm = ({ purchaseId, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handlePaymentSuccess = async (paymentMethodId) => {
    const isPaymentSuccessful = await updatePurchaseToPaid(purchaseId, paymentMethodId);

    if (isPaymentSuccessful) {
      console.log("Actualización exitosa, redirigiendo...");
      dispatch(emptyCart()); 
      navigate(`/purchases/${purchaseId}`);
    } else {
      console.error("Error al actualizar la compra.");
      setErrorMessage("Error al actualizar la compra. Inténtalo de nuevo.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumberElement = elements.getElement(CardNumberElement);
    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumberElement,
    });

    if (!error) {
      console.log("Pago exitoso:", paymentMethod);
      try {
        await handlePaymentSuccess(paymentMethod.id);
      } catch (error) {
        setErrorMessage("Error al procesar el pago. Inténtalo de nuevo.");
      }
    } else {
      console.log("Error en el pago:", error.message);
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const updatePurchaseToPaid = async (purchaseId, paymentMethodId) => {
    try {
      const response = await fetch(`${ENDPOINTS.PURCHASES}/${purchaseId}/pay`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: paymentMethodId,
          status: "succeeded",
          lastModified: Date.now(),
          paymentDate: new Date().toISOString(),
          emailAccount: "user@example.com",
        }),
      });

      const data = await response.json();
      console.log("Respuesta de la API:", data);

      if (!response.ok) {
        console.error("Respuesta no OK:", response.status, data);
        throw new Error("Error al actualizar la compra");
      }

      return true; 
    } catch (error) {
      console.error("Error al actualizar la compra:", error);
      return false;
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        color: "#333",
        fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        fontSize: "16px",
        letterSpacing: "0.025em",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12} sx={{ mt: 2 }}>
          <Typography variant="body2">Número de tarjeta</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <CardNumberElement options={cardElementOptions} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2">Fecha de caducidad</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <CardExpiryElement options={cardElementOptions} />
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2">Código de verificación</Typography>
          <Box
            sx={{
              border: "1px solid #ccc",
              padding: "8px",
              borderRadius: "4px",
            }}
          >
            <CardCvcElement options={cardElementOptions} />
          </Box>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!stripe || loading}
        sx={{ mt: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "Pagar"}
      </Button>

      {/* Snackbar para los mensajes de error */}
      <Snackbar
        open={!!errorMessage}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} 
      />

      {/* Snackbar para los mensajes de éxito */}
      <Snackbar
        open={!!successMessage}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} 
      />
    </form>
  );
};

export default StripePaymentForm;
