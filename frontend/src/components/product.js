import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  return (
    <Card sx={{ my: 3, p: 2, height: '100%' }} className="card-container">
      <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          sx={{ height: 200 }}
        />
      </Link>

      <CardContent className="card-content">
        <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
          <Typography variant="h4" component="div" className="product-name">
            {product.name}
          </Typography>
        </Link>
        <Typography variant="h6" component="div">
          {product.price}€
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Product;
