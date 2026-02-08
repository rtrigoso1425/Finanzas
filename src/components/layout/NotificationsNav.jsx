import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useNotifications } from "@/hooks/useNotifications";
import { getTimeAgo } from "@/utils/timeAgo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Bell,
    FileText,
    UserPlus,
} from "lucide-react";

const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.substring(0, 2).toUpperCase();
}

export function NotificationsNav() {
    const notifications = useNotifications();
    const notificationsCount = notifications.length;
    const [tab, setTab] = useState("all");
    const navigate = useNavigate();

    const filtered = tab === "unread" ? notifications.filter((n) => n.type==="friend_request") : notifications;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    size="icon"
                    variant="outline"
                    className="relative"
                    aria-label="Open notifications">
                    <Bell size={16} strokeWidth={2} aria-hidden="true" />
                    {notificationsCount > 0 && (
                        <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                        {notificationsCount > 99 ? "99+" : notificationsCount}
                        </Badge>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0">
                {/* Header with Tabs + Mark All */}
                <Tabs value={tab} onValueChange={setTab}>
                    <div className="flex items-center justify-between border-b px-3 py-2">
                        <TabsList className="bg-transparent">
                            <TabsTrigger value="all" className="text-sm">Todas</TabsTrigger>
                                <TabsTrigger value="unread" className="text-sm">
                                Solicitud de amistad {notificationsCount > 0 && <Badge className="ml-1">{notificationsCount}</Badge>}
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                No hay notificaciones {tab === "unread" && "sin leer"}.
                            </div>
                        ) : (
                            filtered.map((n) => {
                                const Icon = n.type === "friend_request" ? UserPlus : FileText; // Puedes mapear más tipos a íconos aquí
                                return (
                                    <button
                                    key={n.id}
                                    onClick={() =>  navigate(n.link)}
                                    className="flex w-full items-start gap-3 border-b px-3 py-3 text-left hover:bg-accent">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={n.avatar_url} alt="Avatar" />
                                            <AvatarFallback>{getInitials(n.user)}</AvatarFallback>
                                        </Avatar>
                                        <div className="mt-1 text-muted-foreground">
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <p
                                                className={`text-sm ${
                                                    n.unread ? "font-semibold text-foreground" : "text-foreground/80"
                                                }`}>
                                                {n.user} {n.action}{" "}
                                                <span className="font-medium">{n.target}</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">{getTimeAgo(n.timestamp)}</p>
                                        </div>
                                    {n.unread && (
                                        <span className="mt-1 inline-block size-2 rounded-full bg-primary" />
                                    )}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </Tabs>

                {/* Footer */}
                <div className="px-3 py-2 text-center">
                    <Link variant="ghost" size="sm" className="w-full" to="/notifications">
                        Ver todas las notificaciones
                    </Link>
                </div>
            </PopoverContent>
        </Popover>
    );
}