import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/useNotifications";
import { useGroupObjectives } from "@/hooks/useGroupObjectives";
import { getTimeAgo } from "@/utils/timeAgo";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    FileText,
    UserPlus,
    Users,
    Loader2,
    Check,
    X,
} from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import { friendshipService } from '@/features/friendship/friendshipService';
import { removeNotification, fetchNotifications } from '@/features/notifications/notificationsSlice';

// Función auxiliar para iniciales
const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
};

export function NotificationsNav() {
    const { notifications, loading } = useNotifications();
    const { acceptInvitation, rejectInvitation } = useGroupObjectives();
    const [tab, setTab] = useState("all");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user: currentUser } = useSelector((state) => state.auth);
    const [processing, setProcessing] = useState(null);

    // Filtros seguros (usando optional chaining por seguridad)
    const notificationsCount = notifications?.filter((n) => n.type === "friend_request").length || 0;
    const groupInvitationsCount = notifications?.filter((n) => n.type === "group_invitation").length || 0;
    
    const filtered = tab === "friend_request" 
        ? notifications?.filter((n) => n.type === "friend_request") 
        : tab === "group_invitations"
        ? notifications?.filter((n) => n.type === "group_invitation")
        : notifications;

    const handleAccept = async (n) => {
        try {
            setProcessing(n.rawId);
            if (n.type === 'friend_request') {
                await friendshipService.acceptRequest(n.friendshipId || n.id.replace('req-', ''));
            } else if (n.type === 'group_invitation') {
                await acceptInvitation(n.rawId);
            }
            dispatch(fetchNotifications(currentUser.id));
            dispatch(removeNotification(n.rawId));
        } catch (err) {
            console.error(err);
            alert('Error al aceptar');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (n) => {
        try {
            setProcessing(n.rawId);
            if (n.type === 'friend_request') {
                const idToDelete = n.friendshipId || n.id.replace('req-', '');
                await friendshipService.removeFriendship(idToDelete);
            } else if (n.type === 'group_invitation') {
                await rejectInvitation(n.rawId);
            }
            dispatch(removeNotification(n.rawId));
        } catch (err) {
            console.error(err);
            alert('Error al rechazar');
        } finally {
            setProcessing(null);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant="ghost"
                    className="relative rounded-full"
                    aria-label="Open notifications"
                >
                    <Bell size={20} strokeWidth={2} />
                    {notificationsCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-[380px] p-0" align="end">
                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h4 className="font-semibold">Notificaciones</h4>
                    </div>
                    
                    {/* Tabs */}
                    <div className="px-2 pt-2">
                        <TabsList className="w-full grid grid-cols-3">
                            <TabsTrigger value="all">Todas</TabsTrigger>
                            <TabsTrigger value="friend_request" className="relative">
                                Solicitudes
                                {notificationsCount > 0 && (
                                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                                        {notificationsCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="group_invitations" className="relative">
                                Invitaciones
                                {groupInvitationsCount > 0 && (
                                    <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                                        {groupInvitationsCount}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Lista de Notificaciones */}
                    <div className="max-h-[400px] overflow-y-auto py-2">
                        {loading ? (
                            <div className="flex justify-center py-8 text-muted-foreground">
                                <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                        ) : filtered?.length === 0 ? (
                            <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                                <Bell className="mx-auto h-8 w-8 opacity-20 mb-2" />
                                No hay {tab === "all" ? "notificaciones" : tab === "friend_request" ? "solicitudes de amistad" : "invitaciones a objetivos grupales"} recientes.
                            </div>
                        ) : (
                            filtered.map((n) => {
                                const Icon = n.type === "friend_request" ? UserPlus : n.type === "friend" ? Users : FileText;
                                const iconColor = n.type === "friend_request" ? "text-blue-500" : n.type === "friend" ? "text-green-500" : "text-gray-500";
                                
                                return (
                                    <div // Cambiado de button a div
                                        key={n.id}
                                        onClick={() => {
                                            navigate(n.link);
                                        }}
                                        className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b last:border-0 cursor-pointer"
                                    >
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 border">
                                                <AvatarImage src={n.avatar_url} alt="Avatar" />
                                                <AvatarFallback>{getInitials(n.user)}</AvatarFallback>
                                            </Avatar>
                                            <div className={`absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm border ${iconColor}`}>
                                                <Icon size={12} strokeWidth={3} />
                                            </div>
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm leading-snug">
                                                <span className="font-semibold text-foreground">{n.full_name || n.user}</span>{" "}
                                                <span className="text-muted-foreground">{n.action}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                {n.timestamp ? getTimeAgo(n.timestamp) : "Reciente"}
                                            </p>
                                            {(n.type === 'friend_request' || n.type === 'group_invitation') && (
                                                <div className="mt-2 flex gap-2">
                                                    <Button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleAccept(n);
                                                        }} 
                                                        disabled={processing === n.rawId} 
                                                        size="sm"
                                                    >
                                                        {processing === n.rawId ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check size={12} />} Aceptar
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleReject(n);
                                                        }} 
                                                        disabled={processing === n.rawId} 
                                                        size="sm"
                                                    >
                                                        <X size={12} /> Rechazar
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                        
                                        {n.unread && (
                                            <span className="h-2 w-2 rounded-full bg-blue-600 mt-2" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </Tabs>

                {/* Footer */}
                <div className="border-t p-2 bg-muted/30">
                    <Button variant="ghost" className="w-full h-8 text-xs text-muted-foreground" asChild>
                        <Link to="/notifications">
                            Ver historial completo
                        </Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}