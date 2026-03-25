import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications } from "@/features/notifications/notificationsSlice";

export const useNotifications = () => {
    const dispatch = useDispatch();
    
    // Leemos directamente del Store global
    const { items: notifications, status } = useSelector((state) => state.notifications);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && status === 'idle') {
            dispatch(fetchNotifications(user.id));
        }
    }, [user, status, dispatch]);

    // Función para forzar recarga (útil para un botón de "actualizar")
    const refetch = () => {
        if (user) dispatch(fetchNotifications(user.id));
    };

    return { 
        notifications, 
        loading: status === 'loading' && notifications.length === 0, // Solo mostramos loading si no hay datos previos
        refetch 
    };
};