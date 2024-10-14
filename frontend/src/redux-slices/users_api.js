import { apiSlice } from "./api";
import { ENDPOINTS } from "../config";

const userRequestsSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.USERS + "/login",
        method: "POST",
        body: data,
      }),
      providesTags: ["Users"],
    }),
    signUp: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.USERS,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: ENDPOINTS.USERS + "/logout",
        method: "POST",
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.USERS + "/profile",
        method: "PUT",
        body: data,
      }),
    }),
    getAllProfiles: builder.query({
      query: () => ({
        url: ENDPOINTS.USERS,
      }),
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: ENDPOINTS.USERS + `/${userId}`,
        method: "DELETE",
      }),
    }),
    getUsersId: builder.query({
      query: (userId) => ({
        url: ENDPOINTS.USERS + `/${userId}`,
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => {
        return {
          url: ENDPOINTS.USERS + `/${data.userId}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignUpMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetAllProfilesQuery,
  useDeleteUserMutation,
  useGetUsersIdQuery,
  useUpdateUserMutation,
} = userRequestsSlice;
