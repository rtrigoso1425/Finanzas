import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFriendship } from '@/hooks/useFriendship';
import { fetchUserById, clearSearchedUser } from '../features/user/userSlice';
import { Loader2, UserPlus, Clock, Check } from "lucide-react";
const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: currentUser } = useSelector((state) => state.auth);
    const { id: userId } = useParams();
    const { searchedUser, status, error } = useSelector((state) => state.user);
    const { status: friendshipStatus, loading, sendFriendRequest, acceptFriendRequest } = useFriendship(currentUser, userId);
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserById(userId));
        }
        
        return () => {
            dispatch(clearSearchedUser());
        };
    }, [dispatch, userId]);

    if (status === 'loading') {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    if (status === 'failed') {
        navigate('/dashboard'); 
    }

    if (!searchedUser) return null;

    const renderButton = () => {
    // Caso 1: Es tu propio perfil
        if (currentUser?.id === userId) return null;

        if (loading) {
            return (
            <button disabled className="bg-gray-200 text-gray-500 rounded-lg px-4 py-2 text-sm font-medium">
                <Loader2 className="h-4 w-4 animate-spin" />
            </button>
        );
    }

    switch (friendshipStatus) {
        case 'accepted':
            return (
                <button disabled className="bg-green-100 text-green-700 border border-green-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                    <Check size={16} /> Amigos
                </button>
            );
        case 'pending_sent':
            return (
                <button disabled className="bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-not-allowed">
                    <Clock size={16} /> Pendiente
                </button>
            );
        case 'pending_received':
            return (
                <button onClick={acceptFriendRequest} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                    <Check size={16} /> Aceptar Solicitud
                </button>
            );
        default: // 'none'
            return (
                <button
                    onClick={sendFriendRequest}
                    className="bg-gray-900 dark:bg-zinc-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
                >
                    <UserPlus size={16} /> Agregar
                </button>
            );
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100 text-center">
            <img 
                src={searchedUser.avatar_url || "https://i.ibb.co/k6WjwY6N/default.jpg"} 
                alt={searchedUser.username}
                className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-slate-50"
            />
            <h2 className="mt-4 text-xl font-bold text-slate-800">{searchedUser.full_name}</h2>
            <p className="text-slate-500">@{searchedUser.username}</p>
            {renderButton()}
        </div>
    );
}
export default ProfilePage;