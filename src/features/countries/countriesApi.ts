// src/features/countries/countriesApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export type Country = {
  name: { common: string };
  cca2?: string;
  flags?: { png?: string; svg?: string };
};

export const countriesApi = createApi({
  reducerPath: 'countriesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://restcountries.com/v3.1/',
    prepareHeaders: (headers) => {
      // No auth needed for this API, but keep place for headers if required.
      return headers;
    },
    // optionally set a small timeout at fetch level using signal; leave default for now
  }),
  tagTypes: ['Countries'],
  endpoints: (build) => ({
    getAll: build.query<Country[], void>({
      query: () => 'all?fields=name,cca2,flags',
      // transform and sort alphabetically by common name
      transformResponse: (response: Country[]) =>
        (response ?? []).slice().sort((a, b) => a.name.common.localeCompare(b.name.common)),
      providesTags: (result) =>
        result
          ? [...result.map((r) => ({ type: 'Countries' as const, id: r.cca2 ?? r.name.common })), { type: 'Countries', id: 'LIST' }]
          : [{ type: 'Countries', id: 'LIST' }],
    }),
  }),
});

export const { useGetAllQuery } = countriesApi;
