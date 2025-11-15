import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  full_name: string;
  role?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('access_token'),
  user: localStorage.getItem('email') ? {
    id: localStorage.getItem('user_id') || '',
    email: localStorage.getItem('email') || '',
    full_name: localStorage.getItem('full_name') || '',
    role: localStorage.getItem('user_role') || 'user',
  } : null,
  token: localStorage.getItem('access_token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('access_token', action.payload.token);
      localStorage.setItem('email', action.payload.user.email);
      localStorage.setItem('full_name', action.payload.user.full_name);
      localStorage.setItem('user_id', action.payload.user.id);
      if (action.payload.user.role) {
        localStorage.setItem('user_role', action.payload.user.role);
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      localStorage.removeItem('full_name');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;