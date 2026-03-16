import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { friendshipService } from '../friendship/friendshipService'; // Ajusta la ruta
import { groupObjectivesService } from '../groupObjectives/groupObjectivesService';

// 1. Thunk para cargar notificaciones (Lógica movida desde el hook antiguo)
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (userId, { rejectWithValue }) => {
        try {
            const [requestsData, friendsData] = await Promise.all([
                friendshipService.getIncomingRequests(userId),
                friendshipService.getFriends(userId)
            ]);

            const [invitationsData, groupObjectivesData] = await Promise.all([
                groupObjectivesService.getInvitations(userId),
                groupObjectivesService.getGroupObjectives(userId)
            ]);
            const tempNotifications = [];

            // A. Procesar Solicitudes
            if (requestsData) {
                requestsData.forEach(req => {
                    tempNotifications.push({
                        id: `req-${req.id}`,
                        rawId: req.requester.id, // ID del usuario para aceptar/rechazar
                        friendshipId: req.id,    // ID de la relación para la BD
                        user: req.requester.username,
                        full_name: req.requester.full_name,
                        action: "te envió una solicitud de amistad",
                        timestamp: req.created_at,
                        avatar_url: req.requester.avatar_url,
                        type: "friend_request",
                        link: `/profile/${req.requester.username}`,
                    });
                });
            }

            // B. Procesar Amigos
            if (friendsData) {
                friendsData.forEach(friend => {
                    const isRequesterMe = friend.friendship_requester === userId;
                    const otherProfile = isRequesterMe ? friend.requested : friend.requester;
                    
                    if (!otherProfile) return;

                    tempNotifications.push({
                        id: `friend-${friend.id}`,
                        rawId: otherProfile.id,
                        user: otherProfile.username,
                        full_name: otherProfile.full_name,
                        action: isRequesterMe ? "aceptó tu solicitud de amistad" : "ahora es tu amigo",
                        timestamp: friend.updated_at || friend.created_at,
                        avatar_url: otherProfile.avatar_url,
                        type: "friend",
                        link: `/profile/${otherProfile.username}`,
                    });
                });
            }

            //C. Procesar Invitaciones a Objetivos Grupales (si es necesario)
            if (invitationsData) {
                invitationsData.forEach(invite => {
                    tempNotifications.push({
                        id: `invite-${invite.id}`,
                        rawId: invite.group_goal_id, // ID del objetivo grupal para aceptar/rechazar
                        user: invite.group_objectives.profiles.username,
                        full_name: invite.group_objectives.profiles.full_name,
                        action: "te ha invitado a unirte a un objetivo grupal",
                        timestamp: invite.updated_at || invite.created_at,
                        avatar_url: invite.group_objectives.profiles.avatar_url,
                        type: "group_invitation",
                        link: `/group-objectives`,
                    });
                });
            }

            //D. Procesar Objetivos Grupales
            if (groupObjectivesData) {
                groupObjectivesData.forEach(objective => {
                    tempNotifications.push({
                        id: `objective-${objective.id}`,
                        rawId: objective.id,
                        user: objective.profiles.username,
                        full_name: objective.profiles.full_name,
                        action: `Te uniste al objetivo grupal ${objective.group_objectives.objective_name}`,
                        timestamp: objective.updated_at || objective.created_at,
                        avatar_url: objective.profiles.avatar_url,
                        type: "group_objective",
                        link: `/grupal-objectives/${objective.group_goal_id}`,
                    });
                });
            }

            // Ordenar por fecha
            tempNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            return tempNotifications;

        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {
        // Acción para limpiar notificaciones (ej: al hacer logout)
        clearNotifications: (state) => {
            state.items = [];
            state.status = 'idle';
        },
        // Acción para eliminar una notificación manualmente (ej: al aceptar solicitud)
        // Esto hace que la UI se actualice instantáneamente sin recargar todo
        removeNotification: (state, action) => {
            const rawIdToRemove = action.payload; // El ID del usuario o de la solicitud
            state.items = state.items.filter(n => n.rawId !== rawIdToRemove || n.type !== 'friend_request');
        },
        // Acción para agregar una notificación manualmente (ej: WebSocket o actualización optimista)
        addNotification: (state, action) => {
            state.items.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                if (state.status === 'idle') {
                    state.status = 'loading';
                }
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearNotifications, removeNotification, addNotification } = notificationsSlice.actions;
export default notificationsSlice.reducer;