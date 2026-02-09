import { supabase } from "../supabase/supabaseClient";

export const friendshipService = {
  // 1. Enviar solicitud de amistad
    async sendRequest(requesterId, requestedId) {
        const { data, error } = await supabase
        .from('friendship')
        .insert([
            { 
                friendship_requester: requesterId, 
                friend_requested: requestedId, 
                state: 'pending' 
            }
        ])
        .select()
        .single();

        if (error) throw error;
        return data;
    },

    // 2. Verificar el estado de la amistad entre dos personas
    async checkStatus(myId, otherUserId) {
        // Buscamos si existe una relación en CUALQUIER dirección
        const { data, error } = await supabase
        .from('friendship')
        .select('*')
        .or(`and(friendship_requester.eq.${myId},friend_requested.eq.${otherUserId}),and(friendship_requester.eq.${otherUserId},friend_requested.eq.${myId})`)
        .maybeSingle(); // Usamos maybeSingle porque puede que no exista relación

        if (error) throw error;
        return data; // Retorna el objeto friendship o null
    },

    // 3. Aceptar solicitud
    async acceptRequest(friendshipId) {
        const { data, error } = await supabase
        .from('friendship')
        .update({ state: 'accepted', updated_at: new Date() })
        .eq('id', friendshipId)
        .select();

        if (error) throw error;
        return data;
    },

    // 4. Rechazar/Cancelar solicitud (o eliminar amigo)
    async removeFriendship(friendshipId) {
        const { error } = await supabase
        .from('friendship')
        .delete()
        .eq('id', friendshipId);

        if (error) throw error;
    },

    // 5. Obtener solicitudes pendientes (Para tu buzón de notificaciones)
    async getIncomingRequests(myId) {
        const { data, error } = await supabase
        .from('friendship')
        .select(`
            *,
            requester:profiles!friendship_friendship_requester_fkey (
            id, username, full_name, avatar_url
            )
      ` ) // Hacemos un JOIN para traer los datos del perfil que te agregó
        .eq('friend_requested', myId)
        .eq('state', 'pending');

        if (error) throw error;
        return data;
    },
    
    // 6 Obtener Amigos (opcional, para mostrar la lista de amigos en el perfil)
    async getFriends(myId) {
        const { data, error } = await supabase
        .from('friendship')
        .select(`
            *,
            requester:profiles!friendship_friendship_requester_fkey (
            id, username, full_name, avatar_url
            ),
            requested:profiles!friendship_friend_requested_fkey (
            id, username, full_name, avatar_url
            )
        ` )
        .eq('state', 'accepted')
        .or(`friendship_requester.eq.${myId},friend_requested.eq.${myId}`);

        if (error) throw error;
        return data;
    }
};