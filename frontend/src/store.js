import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./redux-slices/api";

import shoppingCartReducer from "./redux-slices/shoppingCart";
import authorizationReducer from "./redux-slices/authorization";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: shoppingCartReducer,
    authorization: authorizationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
