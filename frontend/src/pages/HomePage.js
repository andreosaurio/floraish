import React from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  Grid,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Product from "../components/product";
import Paginate from "../components/Pagination";
import Metadata from "../components/Metadata";
import ProductSlider from "../components/ProductSlider";

import { useGetProductsQuery } from "../redux-slices/products_api";

const HomePage = () => {
  const { pageNumber = 1, searchTerm } = useParams();

  const { data, isLoading, isError } = useGetProductsQuery({
    searchTerm,
    pageNumber,
  });

  if (isLoading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Typography variant="h5" gutterBottom>
          Error loading products
        </Typography>
        <Alert severity="error">
          Ha habido un error al cargar los productos. Inténtalo más tarde.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      {!searchTerm ? (
        <ProductSlider />
      ) : (
        <Button
          component={Link}
          to="/"
          variant="outlined"
          color="primary"
          sx={{ mb: 2 }}
        >
          Volver atrás
        </Button>
      )}{" "}
<Grid container spacing={4}>
  <Metadata title="Floraish | Tienda Online de Plantas" />
  {data.products && data.products.length > 0 ? (
    data.products.map((product) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
        <Product product={product} />
      </Grid>
    ))
  ) : (
    <Grid item xs={12}>
                <Alert severity="warning">
                  Ningún resultado coincide con la búsqueda
                </Alert>
    </Grid>
  )}
</Grid>

      <Paginate
        pages={data.pages}
        page={data.page}
        searchTerm={searchTerm ? searchTerm : ""}
      />
    </Container>
  );
};

export default HomePage;
