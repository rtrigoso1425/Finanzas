/* eslint-disable no-undef */
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  BarChart3,
  Search,
  Receipt,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import React from "react";

// SidebarLink mejorado para mostrar iconos y labels según colapsado
function SidebarLink({ icon: Icon, label, to, active, isCollapsed, isSubItem = false }) {
  const content = (
    <Link
      to={to}
      translate="no"
      className={cn(
        "flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 group font-medium",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        
        // Colapsado: cuadrado perfecto y centrado
        isCollapsed 
          ? "h-10 w-10 justify-center p-0 mx-auto"
          : "px-3", // Expandido: padding interno

        isSubItem && !isCollapsed && "pl-8 text-sm" // Sub-item indentado
      )}
    >
      {/* protect Icon to avoid rendering undefined */}
      {/* ensure icon color is visible in light mode */} 
      {Icon && <Icon className="h-5 w-5 flex-shrink-0 text-muted-foreground" />} 
      <span 
        className={cn(
          "transition-opacity whitespace-nowrap",
          isCollapsed && "opacity-0 hidden"
        )}
      >
        {label}
      </span>
    </Link>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}

// Componente principal Sidebar (UNA SÓLA VISTA)
export function Sidebar({ isCollapsed, onToggle }) {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [expandedSections, setExpandedSections] = React.useState({});

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const isActive = (path) => {
    if (path.includes("?")) {
      const [pPath, pQuery] = path.split("?");
      if (location.pathname !== pPath) return false;
      const wanted = new URLSearchParams(pQuery);
      const current = new URLSearchParams(location.search);
      for (const [k, v] of wanted.entries()) {
        if (current.get(k) !== v) return false;
      }
      return true;
    }
    return location.pathname === path || (path !== "/dashboard" && location.pathname.startsWith(path));
  };

  // Header reutilizable
  const renderHeader = (link, title) => (
    <div className={cn("h-16 border-b flex items-center transition-all duration-300 relative", isCollapsed ? "justify-center px-2" : "px-4")}>
      <Link to={link} className="flex items-center gap-2 overflow-hidden">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
          {title}
        </div>
        <div className={cn("flex flex-col transition-opacity", isCollapsed && "opacity-0 hidden")}>
          <span className="font-bold text-lg tracking-tight whitespace-nowrap">SmartGoal</span>
          <span className="text-xs text-muted-foreground whitespace-nowrap truncate">{user?.subscription}</span>
        </div>
      </Link>
    </div>
  );

  // Wrapper reutilizable
  const renderSidebar = (content) => (
    <aside
      data-collapsed={isCollapsed}
      className={cn(
        "bg-card border-r shadow-lg transition-all duration-300 ease-in-out",
        "h-screen sticky top-0 left-0 z-40 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {content}
    </aside>
  );

  // Única vista con los links solicitados
  return renderSidebar(
    <>
      {renderHeader("/", "SG")}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-4 space-y-4">
        <SidebarLink
          icon={LayoutDashboard}
          label="Tablero"
          to="/dashboard"
          active={isActive("/dashboard")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={BarChart3}
          label="Mi Balance"
          to="/balance"
          active={isActive("/balance")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={Search}
          label="Buscar"
          to="/search"
          active={isActive("/search")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={BookOpen}
          label="Objetivos"
          to="/objectives"
          active={isActive("/objectives")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={Users}
          label="Objetivos grupales"
          to="/grupal-objectives"
          active={isActive("/grupal-objectives")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={Users}
          label="Amigos"
          to="/friends"
          active={isActive("/friends")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={Receipt}
          label="Suscripción"
          to="/subscription"
          active={isActive("/subscription")}
          isCollapsed={isCollapsed}
        />
        <SidebarLink
          icon={Settings}
          label="Configuración"
          to="/settings"
          active={isActive("/settings")}
          isCollapsed={isCollapsed}
        />
      </nav>
    </>
  );
}