import { useEffect } from 'react';
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { useFriendship } from '@/hooks/useFriendship';
import { fetchUserByUsername, clearSearchedUser } from '../features/user/userSlice';
import { BlurFade } from '@/components/ui/blur-fade';
import { SkeletonAvatarWithName } from '@/components/ui/skeleton';
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
        return (
            <div className="flex justify-center items-center min-h-screen p-4">
                <SkeletonAvatarWithName />
            </div>
        );
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
                <button disabled className="w-full bg-gray-200 text-gray-500 rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando...
                </button>
            );
        }

        switch (currentFriendshipStatus) {
            case 'accepted':
                return (
                    <button disabled className="w-full bg-green-100 text-green-700 border border-green-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2">
                        <Check size={16} /> Amigos
                    </button>
                );
            case 'pending_sent':
                return (
                    <button disabled className="w-full bg-yellow-100 text-yellow-700 border border-yellow-200 rounded-lg px-4 py-2 text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed">
                        <Clock size={16} /> Solicitud pendiente
                    </button>
                );
            case 'pending_received':
                return (
                    <div className='space-y-3'>
                        <p className="text-sm text-gray-600">Te envió una solicitud</p>
                        <div className='flex gap-2 flex-col sm:flex-row'>
                            <button onClick={acceptFriendRequest} className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex gap-1 items-center justify-center">
                                <Check size={18} /> Aceptar
                            </button>
                            <button onClick={rejectFriendRequest} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors flex gap-1 items-center justify-center">
                                <X size={18} /> Rechazar
                            </button>
                        </div>
                    </div>
                );
            default: // 'none'
                return (
                    <button
                        onClick={sendFriendRequest}
                        className="w-full bg-gray-900 dark:bg-zinc-800 text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <UserPlus size={16} /> Agregar amigo
                    </button>
                );
        }
    };

    return (
        <BlurFade delay={0.1} inView>
            <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
                <div className="w-full max-w-md p-6 sm:p-8 bg-white rounded-xl shadow-md border border-gray-100 text-center space-y-4">
                    <img 
                        src={searchedUser.avatar_url || "https://i.ibb.co/k6WjwY6N/default.jpg"} 
                        alt={searchedUser.username}
                        className="w-20 sm:w-24 h-20 sm:h-24 rounded-full mx-auto object-cover border-4 border-slate-50"
                    />
                    <div className="space-y-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{searchedUser.full_name}</h2>
                        <p className="text-sm sm:text-base text-slate-500">@{searchedUser.username}</p>
                    </div>
                    {renderButton()}
                </div>
            </div>
        </BlurFade>
    );
}

export default ProfilePage;