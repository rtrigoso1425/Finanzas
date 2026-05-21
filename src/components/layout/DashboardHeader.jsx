import { cn } from "@/lib/utils";
import { UserNav } from "@/components/layout/UserNav";
import { NotificationsNav } from "@/components/layout/NotificationsNav";
import { useSelector } from "react-redux";

export function DashboardHeader() { // isCollapsed y onToggle ELIMINADOS
  const { user } = useSelector((state) => state.auth);
  return (
    <header className={cn(
      "h-16 border-b bg-card/70 flex items-center justify-between px-2 sm:px-4 lg:px-8",
      "sticky top-0 z-30 backdrop-blur-sm gap-4"
    )}>
      <div className="flex items-center min-w-0 flex-1 overflow-hidden">
        {/* Aquí podríamos poner Breadcrumbs o el título de la página en el futuro */}
        <h1 className="text-xs sm:text-sm lg:text-lg font-semibold truncate whitespace-nowrap">
          Bienvenido {user?.full_name}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 flex-shrink-0">
        <NotificationsNav />
        <UserNav />
      </div>
    </header>
  );
}