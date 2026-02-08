import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/UserNav";
import { NotificationsNav } from "@/components/layout/NotificationsNav";
import { useSelector } from "react-redux";

export function DashboardHeader() { // isCollapsed y onToggle ELIMINADOS
  const { user } = useSelector((state) => state.auth);
  return (
    <header className={cn(
      "h-16 border-b bg-card/70 flex items-center justify-between px-6 lg:px-8",
      "sticky top-0 z-30 backdrop-blur-sm"
    )}>
      <div className="flex items-center">
        {/* Aquí podríamos poner Breadcrumbs o el título de la página en el futuro */}
        <h1 className="text-lg font-semibold">Bienvenido {user?.full_name}</h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationsNav />
        <UserNav />
      </div>
    </header>
  );
}