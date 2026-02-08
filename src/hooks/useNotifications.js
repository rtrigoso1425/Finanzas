import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { friendshipService } from "@/features/friendship/friendshipService";

export const useNotifications = () => {
    const [request, setRequest] = useState([]);
    const user = useSelector((state) => state.auth.user);
    
    useEffect(() => {
        const fetchFriendRequests = async () => {
            if (!user) return;
            try {
                const FriendsRequests = []
                const data = await friendshipService.getIncomingRequests(user.id);
                for (const friendrequest of data) {
                    const friendrequestData = {
                        id: friendrequest.id,
                        user: friendrequest.requester.username,
                        action: "te envio una solicitud de amistad",
                        timestamp: friendrequest.created_at,
                        avatar_url: friendrequest.requester.avatar_url,
                        type: "friend_request",
                        link: `/profile/${friendrequest.friendship_requester}`,
                    }
                    FriendsRequests.push(friendrequestData);
                }
                FriendsRequests.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setRequest(FriendsRequests);

            } catch (error) {
                console.error("Error cargando las solicitudes de amistad:", error);
            }
        }
        fetchFriendRequests();
    }, [user.id]);
    return request;
}