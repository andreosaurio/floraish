import { createSlice } from "@reduxjs/toolkit";

const decimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : {
      cartItems: [],
      itemsPrice: 0,
      shippingPrice: 0,
      totalPrice: 0,
      shippingAddress: {},
    };

const calculatePrices = (cartItems) => {
  const itemsPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.price);
    const qty = Number(item.qty);
    if (isNaN(price) || isNaN(qty)) {
      console.error(
        "Error en el cálculo de precios. Precio o cantidad no son números válidos."
      );
      return acc;
    }
    return acc + price * qty;
  }, 0);

  const shippingPrice = itemsPrice >= 49.90 ? 0 : 6.9;
  const totalPrice = itemsPrice + shippingPrice;

  return {
    itemsPrice: decimals(itemsPrice),
    shippingPrice: decimals(shippingPrice),
    totalPrice: decimals(totalPrice),
  };
};


const shoppingCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.cartItems.find((x) => x._id === item._id);

      if (existingItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existingItem._id ? { ...x, qty: item.qty } : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      const { itemsPrice, shippingPrice, totalPrice } = calculatePrices(
        state.cartItems
      );
      state.itemsPrice = itemsPrice;
      state.shippingPrice = shippingPrice;
      state.totalPrice = totalPrice;

      localStorage.setItem("cart", JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);

      const { itemsPrice, shippingPrice, totalPrice } = calculatePrices(
        state.cartItems
      );
      state.itemsPrice = itemsPrice;
      state.shippingPrice = shippingPrice;
      state.totalPrice = totalPrice;

      localStorage.setItem("cart", JSON.stringify(state));
    },

    shippingAddressData: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state));
    },



    emptyCart: (state) => {
      state.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state));
    },
    
    resetCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.totalPrice = 0;
      state.shippingAddress = {};
      localStorage.removeItem("cart"); 
    },
    
  },
});

export const { addToCart, removeFromCart, shippingAddressData, emptyCart, resetCart } =
  shoppingCartSlice.actions;
export default shoppingCartSlice.reducer;