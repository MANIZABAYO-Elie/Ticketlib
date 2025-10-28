// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { countriesApi } from '../features/countries/countriesApi';

export const store = configureStore({
  reducer: {
    // RTK Query reducer
    [countriesApi.reducerPath]: countriesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(countriesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
