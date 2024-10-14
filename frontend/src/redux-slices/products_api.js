import { apiSlice } from "./api";
import { ENDPOINTS } from "../config";

const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ pageNumber, searchTerm }) => ({
        url: ENDPOINTS.PRODUCTS,
        params: {
          pageNumber,
          searchTerm,
        },
      }),
      providesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => `${ENDPOINTS.PRODUCTS}/${id}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    createNewProduct: builder.mutation({
      query: (newProduct) => ({
        url: ENDPOINTS.PRODUCTS,
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products"],
    }),
    editProduct: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.PRODUCTS + `/${data.productId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    editProductImage: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.UPLOAD,
        method: "POST",
        body: data,
      }),
    }),
    removeProduct: builder.mutation({
      query: (productId) => ({
        url: ENDPOINTS.PRODUCTS + `/${productId}`,
        method: "DELETE",
      }),
    }),
    createProductOpinion: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.PRODUCTS + `/${data.productId}/opinions`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    getBestScoreProducts: builder.query({
      query: () => ({
        url: ENDPOINTS.PRODUCTS + "/topscore",
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateNewProductMutation,
  useEditProductMutation,
  useEditProductImageMutation,
  useRemoveProductMutation,
  useCreateProductOpinionMutation,
  useGetBestScoreProductsQuery,
} = productsApiSlice;

export default productsApiSlice;
