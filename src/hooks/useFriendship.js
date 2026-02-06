import { useState, useEffect } from 'react';
import { friendshipService } from '../features/friendship/friendshipService';

export const useFriendship = (currentUser, targetUserId) => {
    const [status, setStatus] = useState('none'); // 'none', 'pending_sent', 'pending_received', 'accepted'
    const [friendshipId, setFriendshipId] = useState(null);
    const [loading, setLoading] = useState(false);

    // Cargar estado inicial
    useEffect(() => {
        if (!currentUser || !targetUserId) return;

        const check = async () => {
        try {
            const data = await friendshipService.checkStatus(currentUser.id, targetUserId);
        
            if (!data) {
                setStatus('none');
            } else {
                setFriendshipId(data.id);
                if (data.state === 'accepted') {
                    setStatus('accepted');
                } else if (data.state === 'pending') {
                    // Diferenciamos si yo la envié o si me la enviaron
                    if (data.friendship_requester === currentUser.id) {
                        setStatus('pending_sent');
                    } else {
                        setStatus('pending_received'); 
                    }
                }
            }
        } catch (error) {
            console.error("Error checking friendship:", error);
        }
    };

    check();
}, [currentUser, targetUserId]);

    // Acción: Enviar solicitud
    const sendFriendRequest = async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await friendshipService.sendRequest(currentUser.id, targetUserId);
            setFriendshipId(data.id);
            setStatus('pending_sent');
        } catch (error) {
            alert("Error enviando solicitud");
        } finally {
            setLoading(false);
        }
    };

  // Acción: Aceptar solicitud (desde la tarjeta misma si quisieras)
    const acceptFriendRequest = async () => {
        if (!friendshipId) return;
        setLoading(true);
        try {
            await friendshipService.acceptRequest(friendshipId);
            setStatus('accepted');
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
            setStatus('none');
            setFriendshipId(null);
        } catch (error) {  
            console.error("Error al rechazar solicitud:", error);
            alert("Error al rechazar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    return { status, loading, sendFriendRequest, acceptFriendRequest, rejectFriendRequest };
};