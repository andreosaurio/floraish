import React from "react";
import { Box, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { SnackbarProvider } from "notistack";

import NavContainer from "./components/NavContainer";
import Footer from "./components/Footer";

const App = () => {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <NavContainer />
        <Box sx={{ flex: "1 0 auto", py: 3 }}>
          <Container>
            <Outlet />
          </Container>
        </Box>
        <Footer />
      </Box>
    </SnackbarProvider>
  );
};

export default App;
