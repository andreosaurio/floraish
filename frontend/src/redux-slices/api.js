import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from '../config';  

const apiQuery = fetchBaseQuery({ baseUrl: API_BASE_URL }); 

export const apiSlice = createApi({  
    reducerPath: 'apiSlice', 
    baseQuery: apiQuery,
    tagTypes: ['Products', 'Purchases', 'Users'],
    endpoints: (builder) => ({}),
});
