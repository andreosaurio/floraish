import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";

import { useSignUpMutation } from "../redux-slices/users_api";
import { setCredentials } from "../redux-slices/authorization";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signUp, { isLoading }] = useSignUpMutation();
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
    if (password !== passwordConfirmation) {
      setError("Las contraseñas no coinciden. Vuelve a intentarlo.");
      return;
    } else {
      try {
        const res = await signUp({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (error) {
        setError(error.data.message || error.error); 
      }
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
        <Typography variant="h5">Crea una cuenta</Typography>
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
            label="Introduce tu nombre"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            variant="outlined"
            required
            fullWidth
            label="Confirma tu contraseña"
            type="password"
            placeholder="Confirma tu contraseña"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
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
            sx={{ mt: 2, position: "relative" }}
            disabled={isLoading}
          >
            {isLoading && (
              <CircularProgress size={24} sx={{ position: "absolute" }} />
            )}
            Regístrate
          </Button>
        </Box>
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            ¿Ya tienes una cuenta?{" "}
            <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
              Inicia sesión
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUpPage;