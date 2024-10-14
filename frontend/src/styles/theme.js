import { createTheme } from "@mui/material/styles";

// Definición de variables de colores
export const colors = {
  verdeOscuro: "#3a7658",
  beige: "#F9EDDD",
  verdePastel: "#8BC3A6",
  verdePlata: "#dce9e1",
  rosaMarron: "#d99088",
  lila: "#dbc4d8",
  rosaChicle: "#FFABC2",
};

const theme = createTheme({
  palette: {
    primary: {
      main: colors.verdeOscuro,
    },
    secondary: {
      main: colors.beige, 
    },
    custom1: {
      main: colors.verdePastel, 
    },
    custom2: {
      main: colors.verdePlata,
    },
    custom3: {
      main: colors.rosaMarron,
    },
  },
  typography: {
    fontFamily: "Montserrat, Arial, sans-serif",
    color: colors.verdeOscuro,
    p: {
      color: colors.verdeOscuro,
    },
    h1: {
      color: colors.beige,
      fontFamily: "Amatic SC, Arial, sans-serif",
    },
    h2: {
      color: colors.beige,
    },
    h3: {
      color: colors.beige,
      fontFamily: "Playwrite CU, Arial, sans-serif",
    },
    h4: {
      color: colors.verdePastel,
    },
    h5: {
      color: colors.rosaMarron,
    },
    h6: {
      color: colors.rosaMarron, 
    },
    body1: {
      color: colors.beige, 
    },
    body2: {
      color: colors.verdePastel, 
    },
    body3: {
      color: colors.rosaMarron, 
    },
    body4: {
      color: colors.lila, 
    },
    body5: {
      color: colors.verdeOscuro,
    },
    body6: {
      color: colors.rosaChicle, 
    },
  },
  components: {
    MuiSelect: {
      styleOverrides: {
        root: {
          color: colors.verdePastel, 
        },
        select: {
          color: colors.verdePastel, 
          "&:focus": {
            backgroundColor: "transparent", 
          },
        },
        icon: {
          color: colors.verdePastel, 
        },
        outlined: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.verdeOscuro, 
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.verdePastel, 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.verdePastel, 
          },
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: colors.verdeOscuro,
          color: "#FFFFFF",
          textTransform: "uppercase", 
        },
        body: {
          color: colors.rosaMarron,
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(odd)': {
            backgroundColor: "#f9f9f9",
          },
          '&:nth-of-type(even)': {
            backgroundColor: "#fff",
          },
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: "separate",
          borderSpacing: "0 10px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderColor: colors.verdePastel,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            color: colors.verdePastel, 
          },
          "& .MuiInputBase-input": {
            color: colors.verdePastel, 
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.verdeOscuro, 
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.verdePastel, 
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: colors.verdePastel,
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: "underline",
          color: colors.verdePastel,
          "&:hover": {
            color: colors.rosaMarron, 
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        ".product-name": {
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        },
        ".card-container": {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
        ".card-content": {
          flex: 1,
        },
        ".review-score span": {
          margin: "0.1rem",
        },
        ".review-score svg": {
          color: "#C2DCD9",
        },
        ".review-score-text": {
          fontSize: "0.8rem",
          fontWeight: 400,
          paddingLeft: "0.2rem",
          color: "#C2DCD9",
        },
      },
    },
  },
});

export default theme;