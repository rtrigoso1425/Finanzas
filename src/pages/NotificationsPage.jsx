import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { friendshipService } from '@/features/friendship/friendshipService';
import { Loader2, UserPlus, Users, FileText, Check, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useNotifications } from '@/hooks/useNotifications';
import { useGroupObjectives } from '@/hooks/useGroupObjectives';
import { getTimeAgo } from '@/utils/timeAgo';
import { removeNotification, fetchNotifications } from '@/features/notifications/notificationsSlice';

const groupByRange = (items) => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const groups = {
        today: [],
        this_week: [],
        this_month: [],
        this_year: [],
        long_ago: [],
    };

    items.forEach((it) => {
        const ts = it.timestamp ? new Date(it.timestamp) : null;
        if (!ts) {
            groups.long_ago.push(it);
            return;
        }

        if (ts >= startOfDay) groups.today.push(it);
        else if (ts >= startOfWeek) groups.this_week.push(it);
        else if (ts >= startOfMonth) groups.this_month.push(it);
        else if (ts >= startOfYear) groups.this_year.push(it);
        else groups.long_ago.push(it);
    });

    return groups;
};

const IconFor = (type) => {
    if (type === 'friend_request') return UserPlus;
    if (type === 'friend') return Users;
    return FileText;
};

const NotificationsPage = () => {
    const dispatch = useDispatch(); // <--- Hook de dispatch
    const { notifications, loading } = useNotifications(); // Usamos refetch si queremos recarga total
    const { acceptInvitation, rejectInvitation } = useGroupObjectives();
    const { user : currentUser } = useSelector((state) => state.auth); // Para obtener el ID del usuario actual
    const [processing, setProcessing] = useState(null);
    
    // Usamos useMemo igual que antes
    const grouped = useMemo(() => groupByRange(notifications), [notifications]);

    const handleAccept = async (notification) => {
        // Nota: Pasamos el objeto notification completo para tener acceso a los IDs
        try {
            setProcessing(notification.rawId);
            
            if (notification.type === 'friend_request') {
                await friendshipService.acceptRequest(notification.friendshipId || notification.id.replace('req-', ''));
            } else if (notification.type === 'group_invitation') {
                await acceptInvitation(notification.rawId);
            }
            dispatch(fetchNotifications(currentUser.id));
            dispatch(removeNotification(notification.rawId));
            
        } catch (err) {
            console.error(err);
            alert('Error al aceptar la solicitud');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (notification) => {
        try {
            setProcessing(notification.rawId);
            if (notification.type === 'friend_request') {
                const idToDelete = notification.friendshipId || notification.id.replace('req-', '');
                await friendshipService.removeFriendship(idToDelete);
            } else if (notification.type === 'group_invitation') {
                await rejectInvitation(notification.rawId);
            }
            
            // Actualizar Redux
            dispatch(removeNotification(notification.rawId));
        } catch (err) {
            console.error(err);
            alert('Error al rechazar la solicitud');
        } finally {
            setProcessing(null);
        }
    };

    // ... (El componente Section se mantiene igual, solo ajusta las llamadas a handleAccept/Reject) ...
    const Section = ({ title, items }) => (
        <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{title} ({items.length})</h3>
            <div className="space-y-2">
                {items.map((n) => {
                    const Icon = IconFor(n.type);
                    return (
                        <div key={n.id} className="flex items-center gap-3 p-3 bg-white border rounded">
                             {/* ... Avatar y textos igual que antes ... */}
                            <div className="relative">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={n.avatar_url} alt={n.user} />
                                    <AvatarFallback>{(n.user || '?').slice(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm border`}>
                                    <Icon size={12} strokeWidth={3} />
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Link to={`/profile/${n.user}`} className="font-medium hover:underline">
                                            {n.full_name || n.user}
                                        </Link>
                                        <div className="text-sm text-muted-foreground">{n.action}</div>
                                    </div>
                                    <div className="text-xs text-muted-foreground">{n.timestamp ? getTimeAgo(n.timestamp) : 'Reciente'}</div>
                                </div>

                                {n.type === 'friend_request' || n.type === 'group_invitation' ? (
                                    <div className="mt-2 flex gap-2">
                                        {/* Pasamos el objeto 'n' completo */}
                                        <Button onClick={() => handleAccept(n)} disabled={processing === n.rawId}>
                                            {processing === n.rawId ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check size={14} /> Aceptar</>}
                                        </Button>
                                        <Button variant="ghost" onClick={() => handleReject(n)} disabled={processing === n.rawId}>
                                            <X size={14} /> Rechazar
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>

            {loading ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
                <div className="space-y-6">
                    {/* Renderizamos solo si hay items en los grupos */}
                    {grouped.today.length > 0 && <Section title="Hoy" items={grouped.today} />}
                    {grouped.this_week.length > 0 && <Section title="Esta semana" items={grouped.this_week} />}
                    {grouped.this_month.length > 0 && <Section title="Este mes" items={grouped.this_month} />}
                    {grouped.this_year.length > 0 && <Section title="Este año" items={grouped.this_year} />}
                    {grouped.long_ago.length > 0 && <Section title="Hace mucho tiempo" items={grouped.long_ago} />}
                    
                    {notifications.length === 0 && (
                        <div className="text-center text-muted-foreground py-10">No tienes notificaciones.</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;