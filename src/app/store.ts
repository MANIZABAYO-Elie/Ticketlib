// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { countriesApi } from '../features/countries/countriesApi';
import { authApi } from './authApi';
import { organizerApi } from './organizerApi';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [countriesApi.reducerPath]: countriesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [organizerApi.reducerPath]: organizerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      countriesApi.middleware,
      authApi.middleware,
      organizerApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
