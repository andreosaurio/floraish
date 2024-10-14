import { apiSlice } from "./api";
import { ENDPOINTS } from "../config";

export const purchaseSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPurchase: builder.mutation({
      query: (purchase) => ({
        url: ENDPOINTS.PURCHASES,
        method: "POST",
        body: { ...purchase },
      }),
    }),
    getPurchaseDetails: builder.query({
      query: (purchaseId) => ({
        url: ENDPOINTS.PURCHASES + `/${purchaseId}`,
        method: "GET",
      }),
    }),
    payPurchase: builder.mutation({
      query: ({ purchaseId, details }) => ({
        url: ENDPOINTS.STRIPE + `/${purchaseId}/pay`,
        method: "PUT",
        body: { ...details },
      }),
    }),
    getStripePublishableKey: builder.query({
      query: () => ({
        url: ENDPOINTS.STRIPE,
      }),
    }),
    getMyPurchases: builder.query({
      query: () => ({
        url: ENDPOINTS.PURCHASES + "/mypurchases",
      }),
    }),
    getPurchases: builder.query({
      query: () => ({
        url: ENDPOINTS.PURCHASES,
      }),
    }),
    deliverPurchase: builder.mutation({
      query: (purchaseId) => ({
        url: ENDPOINTS.PURCHASES + `/${purchaseId}/deliver`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreatePurchaseMutation,
  useGetPurchaseDetailsQuery,
  usePayPurchaseMutation,
  useGetStripePublishableKeyQuery,
  useGetMyPurchasesQuery,
  useGetPurchasesQuery,
  useDeliverPurchaseMutation,
} = purchaseSlice;
