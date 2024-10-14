import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Rating,
} from "@mui/material";
import {
  useGetProductByIdQuery,
  useCreateProductOpinionMutation,
} from "../redux-slices/products_api";
import ReviewScore from "../components/ReviewScore";
import Metadata from "../components/Metadata";
import { addToCart } from "../redux-slices/shoppingCart";
import { colors } from "../styles/theme";

const ProductPage = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [score, setScore] = useState(0);
  const [note, setNote] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const {
    data: product,
    isLoading,
    refetch,
    isError,
  } = useGetProductByIdQuery(productId);

  const [createProductOpinion, { isLoading: loadingReview }] =
    useCreateProductOpinionMutation();

  const { userInfo } = useSelector((state) => state.authorization);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createProductOpinion({
        productId,
        score,
        note,
      }).unwrap();
      refetch();
      setSnackbarSeverity("success");
      setSnackbarMessage("Reseña creada con éxito");
      setSnackbarOpen(true);

      setNote("");
      setScore(0);
    } catch (err) {
      if (err.status === 403) {
        setSnackbarSeverity("warning");
        setSnackbarMessage("Solo puedes reseñar productos que has comprado.");
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          err?.data?.message || err.error || "Error creando reseña"
        );
      }
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Error.</Alert>}

      {!isLoading && !isError && (
        <>
          <Metadata title={product.name} />
          <Button component={Link} to="/" variant="outlined" sx={{ my: 3 }}>
            Volver atrás
          </Button>
          <Grid container spacing={4} alignItems="flex-start">
            <Grid item md={5}>
              <CardMedia
                component="img"
                image={product.image}
                alt={product.name}
                sx={{ width: "100%", mt: 5 }}
              />
            </Grid>
            <Grid
              item
              md={4}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="h4" component="div">
                    {product.name}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <ReviewScore
                      value={product.score}
                      text={`${product.totalOpinions} opiniones`}
                    />
                  </Box>
                </CardContent>
              </Card>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Typography variant="p">{product.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={3}>
              <Card sx={{ p: 2 }}>
                <CardContent>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        variant="body5"
                        sx={{ color: colors.verdeOscuro }}
                      >
                        Precio:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ color: colors.verdeOscuro }}
                      >
                        {product.price}€
                      </Typography>
                    </Box>

                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      {product.stockItems === 0 && (
                        <Alert severity="warning" sx={{ mt: 2 }}>
                          Temporalmente fuera de stock
                        </Alert>
                      )}
                    </Box>
                    {product.stockItems > 0 && (
                      <FormControl
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 120,
                          "& .MuiOutlinedInput-root": { border: "none" },
                        }}
                      >
                        <InputLabel id="qty-label">Cantidad</InputLabel>
                        <Select
                          labelId="qty-label"
                          value={qty}
                          onChange={(e) => setQty(Number(e.target.value))}
                          label="Cantidad"
                        >
                          {[...Array(product.stockItems).keys()].map((x) => (
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
                    )}
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ mt: 2 }}
                      disabled={product.stockItems === 0}
                      onClick={addToCartHandler}
                    >
                      AÑADIR AL CARRITO
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item md={9}>
              <Card>
                <CardContent>
                  <Typography variant="h6">Cuidados</Typography>
                  <Typography variant="p">{product.cares}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Sección de reseñas */}
          <Grid container spacing={3} sx={{ mt: 4 }}>
            <Grid item md={6}>
              <Typography variant="h5">Reseñas</Typography>
              {product.opinions.length === 0 ? (
                <Alert
                  severity="info"
                  sx={{
                    backgroundColor: "#f7eae9", // Fondo personalizado
                    color: "#3c3c3c", // Color del texto e icono
                    "& .MuiAlert-icon": {
                      color: "#ffa726",
                    },
                  }}
                >
                  No hay reseñas aún
                </Alert>
              ) : (
                <Box>
                  {product.opinions.map((opinion) => (
                    <Card key={opinion._id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="h6">{opinion.name}</Typography>
                        <ReviewScore value={opinion.score} readOnly />
                        <Typography variant="body2">
                          {opinion.createdAt.substring(0, 10)}
                        </Typography>
                        <Typography variant="body2">{opinion.note}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
              {userInfo ? (
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                  <Typography variant="h6">Escribe una reseña</Typography>
                  {loadingReview && <CircularProgress />}
                  <Rating
                    value={score}
                    onChange={(e, newValue) => setScore(newValue)}
                  />
                  <TextField
                    label="Comentario"
                    multiline
                    rows={4}
                    fullWidth
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    sx={{ mt: 2 }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    disabled={loadingReview}
                  >
                    Enviar
                  </Button>
                </Box>
              ) : (
                <Alert severity="warning">
                  Por favor, <Link to="/login">inicia sesión</Link> para
                  escribir una reseña.
                </Alert>
              )}
            </Grid>
          </Grid>

          {/* Snackbar para mensajes */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            message={snackbarMessage}
            severity={snackbarSeverity}
          />
        </>
      )}
    </>
  );
};

export default ProductPage;
