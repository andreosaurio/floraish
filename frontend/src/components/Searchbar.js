import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';

const Searchbar = () => {
  const navigate = useNavigate();
  const { searchTerm: urlSearchTerm } = useParams();

  const [searchTerm, setSearchTerm] = useState(urlSearchTerm || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm) {
      navigate(`/search/${searchTerm.trim()}`);
      setSearchTerm('');
    } else {
      navigate('/');
    }
  };

  return (
<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', alignItems: 'center' }}>
  <TextField
    variant="standard"
    type="text"
    name="q"
    onChange={(e) => setSearchTerm(e.target.value)}
    value={searchTerm}
    placeholder="Buscar productos"
    sx={{
      marginRight: 2,
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          border: 'none', // Eliminar el borde del outlined
        },
        '&:before': {
          borderBottom: '2px solid transparent', // Línea inferior inicial invisible
          content: '""', // Asegura que el pseudo-elemento se muestre
          display: 'block', // Asegura que se muestre como bloque
        },
        '&:after': {
          borderBottom: '2px solid #8BC3A6', // Línea inferior al enfocar
          content: '""', // Asegura que el pseudo-elemento se muestre
          display: 'block', // Asegura que se muestre como bloque
        },
        '&:hover:before': {
          borderBottom: '2px solid #8BC3A6', // Línea inferior al pasar el mouse
        },
      },
      position: 'relative', // Necesario para el posicionamiento del pseudo-elemento
      paddingBottom: '8px', // Espacio para la línea inferior
    }}
  />
  <Button
    type="submit"
    variant="contained" // Cambia a "contained" para un fondo
    color="primary"
    sx={{
      borderRadius: '50%', // Hacer el botón redondo
      minWidth: '40px', // Ajustar el ancho mínimo
      minHeight: '40px', // Ajustar la altura mínima
      padding: 0, // Eliminar el padding
      display: 'flex', // Usar flex para centrar el icono
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <SearchIcon />
  </Button>
</Box>
  );
};

export default Searchbar;