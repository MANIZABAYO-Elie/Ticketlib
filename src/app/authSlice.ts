import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoggedIn = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('access_token', action.payload.token);
      localStorage.setItem('email', action.payload.user.email);
      localStorage.setItem('full_name', action.payload.user.fullName);
      localStorage.setItem('user_id', action.payload.user.id);
      localStorage.setItem('user_role', action.payload.user.role);
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('access_token');
      localStorage.removeItem('email');
      localStorage.removeItem('full_name');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem('access_token');
      const email = localStorage.getItem('email');
      const fullName = localStorage.getItem('full_name');
      const userId = localStorage.getItem('user_id');
      const userRole = localStorage.getItem('user_role');
      
      if (token && email) {
        state.isLoggedIn = true;
        state.token = token;
        state.user = {
          id: userId || '',
          email,
          fullName: fullName || '',
          role: userRole || 'customer'
        };
      }
    },
  },
});

export const { login, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;