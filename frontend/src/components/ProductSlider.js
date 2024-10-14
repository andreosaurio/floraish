import React from "react";
import { Link } from "react-router-dom";
import { CircularProgress, Box, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useGetBestScoreProductsQuery } from "../redux-slices/products_api";

const ProductSlider = () => {
  const { data: products, isLoading, error } = useGetBestScoreProductsQuery();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, 
    slidesToScroll: 1,
    autoplay: true,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768, 
        settings: {
          slidesToShow: 2, 
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, 
        settings: {
          slidesToShow: 1, 
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {isLoading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error?.data?.message || error.error}
        </Typography>
      ) : (
        <Box sx={{ width: "100%", my: 4 }}>
          <Slider {...settings}>
            {products.map((product) => (
              <Box key={product._id} sx={{ px: 2 }}>
                <Link
                  to={`/product/${product._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Box
                    component="img"
                    src={product.image}
                    alt={product.name}
                    sx={{
                      width: "100%",
                      height: "300px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Box sx={{ textAlign: "center", mt: 2 }}>
                    <Typography variant="h6" component="h2">
                      {product.name}
                    </Typography>
                  </Box>
                </Link>
              </Box>
            ))}
          </Slider>
        </Box>
      )}
    </>
  );
};

export default ProductSlider;
