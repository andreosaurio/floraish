import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Container,
  Drawer,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme,
  Box,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  LocalFloristOutlined as LocalFloristOutlinedIcon,
  ShoppingBasketOutlined as ShoppingBasketOutlinedIcon,
} from "@mui/icons-material";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

import logo from "../assets/logo.png";
import { useLogoutMutation } from "../redux-slices/users_api";
import { logout } from "../redux-slices/authorization";
import { resetCart } from "../redux-slices/shoppingCart";
import Searchbar from "./Searchbar";

const NavContainer = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.authorization);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [callLogoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await callLogoutApi().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Estado para el menú de usuario
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const userMenuOpen = Boolean(userMenuAnchorEl);

  const handleUserMenuClick = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };

  // Estado para el menú de administrador
  const [adminMenuAnchorEl, setAdminMenuAnchorEl] = useState(null);
  const adminMenuOpen = Boolean(adminMenuAnchorEl);

  const handleAdminMenuClick = (event) => {
    setAdminMenuAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminMenuAnchorEl(null);
  };

  const drawerItems = (
    <div>
      <List>
        <ListItem
          button
          component={Link}
          to="/cart"
          onClick={() => setDrawerOpen(false)}
          sx={{
            color: theme.palette.secondary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          <ListItemText primary="Carrito" />
        </ListItem>

        {userInfo ? (
          <>
            <ListItem
              button
              onClick={handleUserMenuClick}
              sx={{
                color: theme.palette.secondary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
            >
              <ListItemText primary={userInfo.name} />
            </ListItem>
            <Menu
              anchorEl={userMenuAnchorEl}
              open={userMenuOpen}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: theme.palette.custom1.main,
                  marginLeft: "30px",
                },
              }}
            >
              <MenuItem
                component={Link}
                to="/profile"
                onClick={handleUserMenuClose}
              >
                Mi perfil
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleLogout();
                  handleUserMenuClose();
                }}
              >
                Cerrar sesión
              </MenuItem>
            </Menu>
          </>
        ) : (
          <ListItem
            button
            component={Link}
            to="/login"
            onClick={() => setDrawerOpen(false)}
            sx={{
              color: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <ListItemText primary="Inicia sesión" />
          </ListItem>
        )}
      </List>

      {/* Desplegable visible solo para el administrador en el menú hamburguesa */}
      {userInfo && userInfo.isAdmin && (
        <>
          <ListItem
            button
            onClick={handleAdminMenuClick}
            sx={{
              color: theme.palette.secondary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
          >
            <ListItemText primary="Panel de gestión" />
          </ListItem>
          <Menu
            anchorEl={adminMenuAnchorEl}
            open={adminMenuOpen}
            onClose={handleAdminMenuClose}
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.custom1.main,
                marginLeft: "30px",
              },
            }}
          >
            <MenuItem
              component={Link}
              to="/admin/allpurchases"
              onClick={handleAdminMenuClose}
            >
              Gestionar pedidos
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/allproducts"
              onClick={handleAdminMenuClose}
            >
              Gestionar productos
            </MenuItem>
            <MenuItem
              component={Link}
              to="/admin/allusers"
              onClick={handleAdminMenuClose}
            >
              Gestionar usuarios
            </MenuItem>
          </Menu>
        </>
      )}
      <Divider />
    </div>
  );

  return (
    <>
            <Box
      sx={{
        backgroundColor: theme.palette.secondary.main,
        height: "30px",
        display: "flex", 
        alignItems: "center",
        justifyContent: "center", 
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: theme.palette.verdeOscuro, 
          fontWeight: 'bold', 
        }}
      >
        ENVÍO GRATUITO A PARTIR DE 49,90€
      </Typography>
    </Box>

      <AppBar
        position="static"
        color="primary"
        sx={{ boxShadow: 0, height: "120px", justifyContent: "center" }}
      >
        <Container>
          <Toolbar>
            <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  color: "#F9EDDD",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "left",
                }}
              >
                <img src={logo} alt="Floraish" style={{ height: "90px" }} />
                Floraish
              </Link>
            </Typography>
            {isMobile ? (
              <>
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleDrawerToggle}
                  sx={{
                    display: { xs: "block", md: "none" },
                    color: theme.palette.secondary.main,
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Drawer
                  anchor="right"
                  open={drawerOpen}
                  onClose={handleDrawerToggle}
                  sx={{
                    "& .MuiDrawer-paper": {
                      width: 250,
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                    },
                  }}
                >
                  {drawerItems}
                </Drawer>
              </>
            ) : (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <IconButton color="custom1" component={Link} to="/cart">
                  <Badge
                    badgeContent={cartItems.reduce((a, c) => a + c.qty, 0)}
                    color="secondary"
                    sx={{ marginRight: "8px" }}
                  >
                    <ShoppingBasketOutlinedIcon />
                  </Badge>
                  <Typography sx={{ marginLeft: "4px" }}>Carrito</Typography>
                </IconButton>

                {userInfo && userInfo.isAdmin && (
                  <>
                    <IconButton
                      color="custom1"
                      onClick={handleAdminMenuClick}
                      aria-controls="admin-menu"
                      aria-haspopup="true"
                    >
                      {" "}
                      <Badge
                        color="secondary"
                        sx={{ marginRight: "8px" }}
                      >
                        <ManageAccountsIcon />
                      </Badge>
                      <Typography>Panel de gestión</Typography>
                    </IconButton>
                    <Menu
                      id="admin-menu"
                      anchorEl={adminMenuAnchorEl}
                      open={adminMenuOpen}
                      onClose={handleAdminMenuClose}
                      PaperProps={{
                        sx: {
                          backgroundColor: theme.palette.custom1.main,

                          marginLeft: "40px",
                        },
                      }}
                    >
                      <MenuItem
                        component={Link}
                        to="/admin/allpurchases"
                        onClick={handleAdminMenuClose}
                      >
                        Gestionar pedidos
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/admin/allproducts"
                        onClick={handleAdminMenuClose}
                      >
                        Gestionar productos
                      </MenuItem>
                      <MenuItem
                        component={Link}
                        to="/admin/allusers"
                        onClick={handleAdminMenuClose}
                      >
                        Gestionar usuarios
                      </MenuItem>
                    </Menu>
                  </>
                )}

                {userInfo ? (
                  <IconButton color="custom1" onClick={handleUserMenuClick}>
                    <LocalFloristOutlinedIcon />
                    <Typography sx={{ marginLeft: "4px" }}>
                      {userInfo.name}
                    </Typography>
                  </IconButton>
                ) : (
                  <IconButton color="custom1" component={Link} to="/login">
                    <LocalFloristOutlinedIcon />
                    <Typography sx={{ marginLeft: "4px" }}>
                      Iniciar sesión
                    </Typography>
                  </IconButton>
                )}
                <Menu
                  anchorEl={userMenuAnchorEl}
                  open={userMenuOpen}
                  onClose={handleUserMenuClose}
                  PaperProps={{
                    sx: {
                      backgroundColor: theme.palette.custom1.main,
                      marginLeft: "40px",
                    },
                  }}
                >
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleUserMenuClose}
                  >
                    Mi perfil
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      handleLogout();
                      handleUserMenuClose();
                    }}
                  >
                    Cerrar sesión
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Box
        sx={{
          backgroundColor: theme.palette.custom2.main,
          height: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Searchbar sx={{ height: "100%" }} />
      </Box>
    </>
  );
};

export default NavContainer;
