import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <Container>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          sx={{ py: 3 }}
        >
          <Grid item>
            <Typography variant="body5" align="center">
              Floraish &copy; {currentYear}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;
