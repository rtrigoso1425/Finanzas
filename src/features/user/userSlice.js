import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabase/supabaseClient';

// THUNK: Acción asíncrona para buscar usuario por ID
export const fetchUserById = createAsyncThunk(
    'user/fetchUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const { data, error } = await supabase
                .from('profiles') // Asegúrate de que tu tabla se llama 'profiles'
                .select('full_name, username, avatar_url') // Seleccionamos solo lo que pediste
                .eq('id', userId)
                .single(); // Esperamos un solo resultado

            if (error) throw error;
            return data; // Esto será el payload

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        searchedUser: null, // Aquí guardaremos los datos del usuario encontrado
        status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // Acción para limpiar los datos (útil al salir de la página de perfil)
        clearSearchedUser: (state) => {
        state.searchedUser = null;
        state.status = 'idle';
        state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchUserById.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchUserById.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.searchedUser = action.payload; // Guardamos full_name, username, avatar_url
        })
        .addCase(fetchUserById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export const { clearSearchedUser } = userSlice.actions;
export default userSlice.reducer;