import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../supabase/supabaseClient'; 
import { friendshipService } from '@/features/friendship/friendshipService'; // Asegúrate de que la ruta sea correcta

// THUNK: Busca usuario por username Y verifica la amistad al mismo tiempo
export const fetchUserByUsername = createAsyncThunk(
    'user/fetchUserByUsername',
    async ({ username, currentUserId }, { rejectWithValue }) => {
        try {
            // 1. Buscamos al usuario por su username
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('id, full_name, username, avatar_url')
                .ilike('username', username)
                .single();

            if (error) throw error;

            // 2. Valores por defecto para la amistad
            let friendshipStatus = 'none';
            let friendshipId = null;

            // 3. Si hay un usuario logueado y no es su propio perfil, verificamos la amistad
            if (currentUserId && profile.id !== currentUserId) {
                const friendshipData = await friendshipService.checkStatus(currentUserId, profile.id);
                
                if (friendshipData) {
                    friendshipId = friendshipData.id;
                    if (friendshipData.state === 'accepted') {
                        friendshipStatus = 'accepted';
                    } else if (friendshipData.state === 'pending') {
                        // Determinamos si la envié yo o me la enviaron
                        friendshipStatus = (friendshipData.friendship_requester === currentUserId) 
                            ? 'pending_sent' 
                            : 'pending_received';
                    }
                }
            }

            // Devolvemos el perfil Y el estado de la amistad juntos
            return { profile, friendshipStatus, friendshipId };

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        searchedUser: null,
        friendshipStatus: 'none', // Nuevo: Estado de amistad inicial
        friendshipId: null,       // Nuevo: ID de la amistad si existe
        status: 'idle',
        error: null,
    },
    reducers: {
        clearSearchedUser: (state) => {
            state.searchedUser = null;
            state.friendshipStatus = 'none';
            state.friendshipId = null;
            state.status = 'idle';
            state.error = null;
        },
        // Acción para actualizar el estado manualmente (útil para mantener sincronía)
        setFriendshipStatus: (state, action) => {
            state.friendshipStatus = action.payload.status;
            if (action.payload.id) state.friendshipId = action.payload.id;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserByUsername.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchUserByUsername.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.searchedUser = action.payload.profile;
                // Guardamos los datos de amistad que calculamos en el Thunk
                state.friendshipStatus = action.payload.friendshipStatus;
                state.friendshipId = action.payload.friendshipId;
            })
            .addCase(fetchUserByUsername.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearSearchedUser, setFriendshipStatus } = userSlice.actions;
export default userSlice.reducer;