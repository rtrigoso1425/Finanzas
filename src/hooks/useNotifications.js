import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { friendshipService } from "@/features/friendship/friendshipService";

export const useNotifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        // Si no hay usuario, no hacemos nada, pero NO retornamos antes del hook
        if (!user) {
            setLoading(false);
            return;
        }

        let isMounted = true; // Evita actualizar estado si el componente se desmonta

        const loadData = async () => {
            setLoading(true);
            try {
                // 1. Ejecutamos ambas peticiones en paralelo y esperamos a las dos
                const [requestsData, friendsData] = await Promise.all([
                    friendshipService.getIncomingRequests(user.id),
                    friendshipService.getFriends(user.id)
                ]);

                // 2. Creamos el array AQUÍ dentro (variable local), así siempre empieza vacío
                const tempNotifications = [];

                // --- A. Procesar Solicitudes Pendientes ---
                if (requestsData) {
                    requestsData.forEach(req => {
                        tempNotifications.push({
                            id: `req-${req.id}`, // Prefijo para asegurar Key única
                            user: req.requester.username,
                            action: "te envió una solicitud de amistad",
                            timestamp: req.created_at,
                            avatar_url: req.requester.avatar_url,
                            type: "friend_request",
                            link: `/profile/${req.requester.username}`,
                        });
                    });
                }

                // --- B. Procesar Amigos Aceptados ---
                if (friendsData) {
                    friendsData.forEach(friend => {
                        // Lógica para saber quién es la "otra" persona
                        const isRequesterMe = friend.friendship_requester === user.id;
                        
                        // Si yo lo pedí, la otra persona es 'requested'. Si me lo pidieron, es 'requester'.
                        const otherProfile = isRequesterMe ? friend.requested : friend.requester;
                        
                        // Protección por si el perfil fue borrado
                        if (!otherProfile) return;

                        tempNotifications.push({
                            id: `friend-${friend.id}`, // Prefijo para asegurar Key única
                            user: otherProfile.username,
                            action: isRequesterMe ? "aceptó tu solicitud de amistad" : "ahora es tu amigo",
                            timestamp: friend.updated_at || friend.created_at,
                            avatar_url: otherProfile.avatar_url,
                            type: "friend",
                            link: `/profile/${otherProfile.username}`,
                        });
                    });
                }

                // 3. Ordenar por fecha (más reciente primero)
                tempNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                // 4. Guardar en el estado una sola vez
                if (isMounted) {
                    setNotifications(tempNotifications);
                }

            } catch (error) {
                console.error("Error cargando notificaciones:", error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadData();

        // Función de limpieza
        return () => {
            isMounted = false;
        };
    }, [user?.id]); 

    return { notifications, loading };
};