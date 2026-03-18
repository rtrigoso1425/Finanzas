import { useEffect } from 'react';
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useFriendship } from '@/hooks/useFriendship';
import { fetchUserByUsername, clearSearchedUser } from '../features/user/userSlice';
import { Loader2, UserPlus, Clock, Check, X } from "lucide-react";

const ProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { username: userUsername } = useParams();
    
    // 1. Obtenemos TU usuario logueado
    const { user: currentUser } = useSelector((state) => state.auth);
    
    // 2. Obtenemos el perfil buscado Y el estado de amistad desde Redux
    const { searchedUser, status: pageStatus, friendshipStatus, friendshipId } = useSelector((state) => state.user);

    // 3. Pasamos 'friendshipStatus' y 'friendshipId' como valores iniciales al hook
    const { 
        status: currentFriendshipStatus, 
        loading, 
        sendFriendRequest, 
        acceptFriendRequest, 
        rejectFriendRequest 
    } = useFriendship(currentUser, searchedUser?.id, friendshipStatus, friendshipId);

    useEffect(() => {
        if (userUsername) {
            // 4. IMPORTANTE: Enviamos currentUserId para que el Thunk calcule la amistad
            dispatch(fetchUserByUsername({ 
                username: userUsername, 
                currentUserId: currentUser?.id 
            }));
        }
        
        return () => {
            dispatch(clearSearchedUser());
        };
    }, [dispatch, userUsername, currentUser?.id]);

    // Loading de la PÁGINA completa (incluye la carga de amistad ahora)
    if (pageStatus === 'loading') {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    }

    if (pageStatus === 'failed') {
        return <Navigate to="/dashboard" replace />;
    }

    if (!searchedUser) return null;

    const renderButton = () => {
        // No mostrar botón si es mi propio perfil
        if (currentUser?.id === searchedUser?.id) return null;

        // Loading de la ACCIÓN del botón (enviar/aceptar)
        if (loading) {
            return (
                <button disabled className="bg-gray-200 text-gray-500 rounded-lg px-4 py-2 text-sm font-medium">
                    <Loader2 className="h-4 w-4 animate-spin" />
                </button>
            );
        }

        switch (currentFriendshipStatus) {
            case 'accepted':
                return (
                    <div className='max-w-md mx-auto text-center mt-4 flex gap-4 justify-center'>
                        <button disabled className="bg-green-100 text-green-700 border border-green-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2">
                            <Check size={16} /> Amigos
                        </button>
                    </div>
                );
            case 'pending_sent':
                return (
                    <div className='max-w-md mx-auto text-center mt-4 flex gap-4 justify-center'>
                        <button disabled className="bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-not-allowed">
                            <Clock size={16} /> Pendiente
                        </button>
                    </div>
                );
            case 'pending_received':
                return (
                    <div className='max-w-md mx-auto text-center mt-4 justify-center'>
                        <span className="block mb-2 text-sm text-gray-600">Te envió una solicitud</span>
                        <div className='flex gap-4 justify-center'>
                            <button onClick={acceptFriendRequest} className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex gap-1 items-center">
                                <Check size={18} /> Aceptar
                            </button>
                            <button onClick={rejectFriendRequest} className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex gap-1 items-center">
                                <X size={18} /> Rechazar
                            </button>
                        </div>
                    </div>
                );
            default: // 'none'
                return (
                    <div className='max-w-md mx-auto text-center mt-4 flex gap-4 justify-center'>
                        <button
                            onClick={sendFriendRequest}
                            className="bg-gray-900 dark:bg-zinc-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
                        >
                            <UserPlus size={16} /> Agregar
                        </button>
                    </div>
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