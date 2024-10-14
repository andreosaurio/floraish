import React, { useState, useEffect } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Link
} from "@mui/material";

import { useLoginMutation } from "../redux-slices/users_api";
import { setCredentials } from "../redux-slices/authorization";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); 

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.authorization);

  const { search } = useLocation();
  const searchParam = new URLSearchParams(search);
  const redirect = searchParam.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (error) {
      setError(error.data.message || error.error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography variant="h5">Inicia sesión</Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 3,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Introduce tu email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Introduce tu contraseña"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress size={24} sx={{ position: "absolute" }} />
            )}
            Acceder
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            ¿Aún no tienes una cuenta?{" "}
            <Link component={RouterLink} to={redirect ? `/signup?redirect=${redirect}` : "/signup"}>
              Haz click aquí
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInPage;