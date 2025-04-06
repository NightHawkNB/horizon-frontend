import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_URL = "http://localhost:8000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BACKEND_URL}/api/`,
    prepareHeaders: async (headers, { getState }) => {
      const token = await window?.Clerk?.session?.getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    },
  }),
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: () => "hotels",
    }),
    getHotelById: builder.query({
      query: (id) => `hotels/${id}`,
    }),
    getHotelsForSearch: builder.query({
      query: ({ searchQuery }) => `hotels/search/retrieve?query=${searchQuery}`,
    }),
    createHotel: builder.mutation({
      query: (hotel) => ({
        url: "hotels",
        method: "POST",
        body: hotel,
      }),
    }),
    createBooking: builder.mutation({
      query: (booking) => ({
        url: "bookings",
        method: "POST",
        body: booking,
      }),
    }),
    getBookingsUser: builder.query({
      query: () => "bookings/user",
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useGetBookingsUserQuery,
  useCreateBookingMutation,
  useGetHotelsForSearchQuery,
} = api;
