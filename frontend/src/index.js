import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./styles/index.css";
import App from "./App";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import theme from "./styles/theme";
import RestrictedRoute from "./components/RestrictedRoute";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import Cart from "./pages/Cart";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import ShippingPage from "./pages/ShippingPage";
import PurchasePage from "./pages/PurchasePage";
import PurchaseSummaryPage from "./pages/PurchaseSummaryPage";
import ProfilePage from "./pages/ProfilePage";
import AllPurchasesPage from "./pages/AllPurchasesPage";
import AllProductsPage from "./pages/AllProductsPage";
import EditProductPage from "./pages/EditProductPage";
import AllUsersPage from "./pages/AllUsersPage";
import EditUserPage from "./pages/EditUserPage";

import store from "./store";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); 

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<HomePage />} />
      <Route path="/search/:searchTerm" element={<HomePage />} />
      <Route path="/page/:pageNumber" element={<HomePage />} />
      <Route
        path="/search/:searchTerm/page/:pageNumber"
        element={<HomePage />}
      />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<Cart />} />{" "}
      <Route path="/login" element={<SignInPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="" element={<RestrictedRoute />}>
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/purchases" element={<PurchasePage />} />
        <Route path="/purchases/:id" element={<PurchaseSummaryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/allpurchases" element={<AllPurchasesPage />} />
        <Route path="/admin/allproducts" element={<AllProductsPage />} />
        <Route
          path="/admin/allproducts/:pageNumber"
          element={<AllProductsPage />}
        />
        <Route path="/admin/product/:id/update" element={<EditProductPage />} />
        <Route path="/admin/allusers" element={<AllUsersPage />} />
        <Route path="/admin/user/:id/edit" element={<EditUserPage />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Elements stripe={stripePromise}>
            {" "}
            <RouterProvider router={router} />
          </Elements>
        </ThemeProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
