// src/app/apiEntry.ts
import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

// Configure the base query
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}`, // from your .env file
  prepareHeaders: (headers) => {
    // If you have a token in localStorage, include it in headers
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});