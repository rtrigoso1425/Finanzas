import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from './authService'; // Asumiendo que tienes un authService

const user = JSON.parse(localStorage.getItem("user"));

// Acción async para refrescar el usuario desde la BD
export const refreshUserFromDB = createAsyncThunk(
  'auth/refreshUserFromDB',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser(); // Llamada a tu BD
      return response; // Devuelve el usuario actualizado
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: user || null,
    isAuthenticated: !!user,
    isLoading: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      localStorage.removeItem('user');
    },
    updateAvatar: (state, action) => {
      if (state.user) {
        state.user.avatar_url = action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(refreshUserFromDB.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshUserFromDB.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(refreshUserFromDB.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setUser, logout, updateAvatar, setLoading } = authSlice.actions;
export default authSlice.reducer;