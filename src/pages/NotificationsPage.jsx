import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { friendshipService } from '@/features/friendship/friendshipService';
import { Loader2, UserPlus, Users, FileText, Check, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { getTimeAgo } from '@/utils/timeAgo';

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
    const user = useSelector((s) => s.auth.user);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    const load = async () => {
        if (!user) return setLoading(false);
        setLoading(true);
        try {
            const [requestsData, friendsData] = await Promise.all([
                friendshipService.getIncomingRequests(user.id),
                friendshipService.getFriends(user.id),
            ]);

            const temp = [];
            if (requestsData) {
                requestsData.forEach((req) => {
                    temp.push({
                        id: `req-${req.id}`,
                        rawId: req.id,
                        user: req.requester.username,
                        full_name: req.requester.full_name,
                        action: 'te envió una solicitud de amistad',
                        timestamp: req.created_at,
                        avatar_url: req.requester.avatar_url,
                        type: 'friend_request',
                    });
                });
            }

            if (friendsData) {
                friendsData.forEach((friend) => {
                    const isRequesterMe = friend.friendship_requester === user.id;
                    const other = isRequesterMe ? friend.requested : friend.requester;
                    if (!other) return;
                    temp.push({
                        id: `friend-${friend.id}`,
                        rawId: friend.id,
                        user: other.username,
                        full_name: other.full_name,
                        action: isRequesterMe ? 'aceptó tu solicitud' : 'ahora es tu amigo',
                        timestamp: friend.updated_at || friend.created_at,
                        avatar_url: other.avatar_url,
                        type: 'friend',
                    });
                });
            }

            temp.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setNotifications(temp);
        } catch (err) {
            console.error('Error cargando notificaciones:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    const grouped = useMemo(() => groupByRange(notifications), [notifications]);

    const handleAccept = async (rawId) => {
        try {
            setProcessing(rawId);
            await friendshipService.acceptRequest(rawId);
            // remove request from list and add friend notification
            setNotifications((prev) => prev.filter((n) => !(n.type === 'friend_request' && n.rawId === rawId)));
            // refresh to show friend event
            await load();
        } catch (err) {
            console.error(err);
            alert('Error al aceptar la solicitud');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (rawId) => {
        try {
            setProcessing(rawId);
            await friendshipService.removeFriendship(rawId);
            setNotifications((prev) => prev.filter((n) => !(n.type === 'friend_request' && n.rawId === rawId)));
        } catch (err) {
            console.error(err);
            alert('Error al rechazar la solicitud');
        } finally {
            setProcessing(null);
        }
    };

    const Section = ({ title, items }) => (
        <section className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{title} ({items.length})</h3>
            <div className="space-y-2">
                {items.map((n) => {
                    const Icon = IconFor(n.type);
                    return (
                        <div key={n.id} className="flex items-center gap-3 p-3 bg-white border rounded">
                            <div className="relative">
                                <Avatar className="h-10 w-10 border">
                                    <AvatarImage src={n.avatar_url} alt={n.user} />
                                    <AvatarFallback>{(n.user || '?').slice(0,2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-0.5 shadow-sm border text-xs">
                                    <Icon size={12} />
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

                                {n.type === 'friend_request' && (
                                    <div className="mt-2 flex gap-2">
                                        <Button onClick={() => handleAccept(n.rawId)} disabled={processing === n.rawId}>
                                            {processing === n.rawId ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check size={14} /> Aceptar</>}
                                        </Button>
                                        <Button variant="ghost" onClick={() => handleReject(n.rawId)} disabled={processing === n.rawId}>
                                            <X size={14} /> Rechazar
                                        </Button>
                                    </div>
                                )}
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
                    <Section title="Hoy" items={grouped.today} />
                    <Section title="Esta semana" items={grouped.this_week} />
                    <Section title="Este mes" items={grouped.this_month} />
                    <Section title="Este año" items={grouped.this_year} />
                    <Section title="Hace mucho tiempo" items={grouped.long_ago} />
                </div>
            )}
        </div>
    );
};

export default NotificationsPage;