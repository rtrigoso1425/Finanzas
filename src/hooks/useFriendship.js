import { useState, useEffect } from 'react';
import { friendshipService } from '../features/friendship/friendshipService';
import { useDispatch } from 'react-redux';
import { setFriendshipStatus } from '../features/user/userSlice'; 
import { fetchNotifications } from '../features/notifications/notificationsSlice';

export const useFriendship = (currentUser, targetUserId, initialStatus = 'none', initialFriendshipId = null) => {
    const dispatch = useDispatch();
    
    // Inicializamos el estado DIRECTAMENTE con lo que viene de Redux (si existe)
    const [status, setStatus] = useState(initialStatus);
    const [friendshipId, setFriendshipId] = useState(initialFriendshipId);
    const [loading, setLoading] = useState(false);

    // Sincronizar si los props iniciales cambian (cuando Redux termina de cargar)
    useEffect(() => {
        setStatus(initialStatus);
        setFriendshipId(initialFriendshipId);
    }, [initialStatus, initialFriendshipId]);

    // Función auxiliar para actualizar Local y Redux al mismo tiempo
    const updateState = (newStatus, newId = null) => {
        setStatus(newStatus);
        if (newId) setFriendshipId(newId);
        
        // Actualizamos Redux para que si navegas y vuelves, se mantenga el estado
        dispatch(setFriendshipStatus({ status: newStatus, id: newId }));
    };

    const sendFriendRequest = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await friendshipService.sendRequest(currentUser.id, targetUserId);
            updateState('pending_sent', data.id);
        } catch (error) {
            console.error("Error detallado de Supabase:", error); 
            alert(`Error: ${error.message || error.details || "Revisa la consola"}`);
        } finally {
            setLoading(false);
        }
    };

    const acceptFriendRequest = async () => {
        if (!friendshipId) return;
        setLoading(true);
        try {
            await friendshipService.acceptRequest(friendshipId);
            updateState('accepted', friendshipId);
            dispatch(fetchNotifications(currentUser.id)); 
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const rejectFriendRequest = async () => {
        if (!friendshipId) return;
        setLoading(true);
        try {
            await friendshipService.removeFriendship(friendshipId);
            updateState('none', null);
            setFriendshipId(null); // Limpiamos ID localmente también
            dispatch(fetchNotifications(currentUser.id)); 
        } catch (error) {
            console.error("Error al rechazar solicitud:", error);
            alert("Error al rechazar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return { status, loading, sendFriendRequest, acceptFriendRequest, rejectFriendRequest };
};