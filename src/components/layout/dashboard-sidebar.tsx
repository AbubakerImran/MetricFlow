"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/ui-store";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  BarChart3,
  FolderOpen,
  Users,
  Activity,
  Settings,
  Key,
  FileText,
  ChevronsLeft,
  ChevronsRight,
  Menu,
  LogOut,
  User,
  Zap,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/projects", icon: FolderOpen, label: "Projects" },
  { href: "/dashboard/team", icon: Users, label: "Team" },
  { href: "/dashboard/activity", icon: Activity, label: "Activity" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/api-keys", icon: Key, label: "API Keys" },
  { href: "/docs", icon: FileText, label: "Docs" },
];

function SidebarContent() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { sidebarCollapsed, toggleSidebarCollapsed } = useUIStore();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 p-4">
        <Logo showText={!sidebarCollapsed} />
        {!sidebarCollapsed && (
          <Badge variant="secondary" className="ml-auto text-xs">
            PRO
          </Badge>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-indigo-500/10 text-indigo-500 font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                sidebarCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {!sidebarCollapsed && (
        <div className="mx-3 mb-3 rounded-lg border bg-indigo-500/5 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-indigo-500" />
            <span className="text-sm font-medium">Upgrade Plan</span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            Get more features with Pro.
          </p>
          <Button
            size="sm"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs"
            asChild
          >
            <Link href="/dashboard/settings">Upgrade</Link>
          </Button>
        </div>
      )}

      <div className="border-t p-3">
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center gap-3 w-full rounded-lg px-2 py-1.5 hover:bg-accent transition-colors",
                  sidebarCollapsed && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session?.user?.image || ""} />
                  <AvatarFallback className="bg-indigo-500/10 text-indigo-500 text-xs">
                    {session?.user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <div className="text-left min-w-0">
                    <p className="text-sm font-medium truncate">
                      {session?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" /> Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <button
        onClick={toggleSidebarCollapsed}
        className="hidden lg:flex items-center justify-center border-t py-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {sidebarCollapsed ? (
          <ChevronsRight className="h-4 w-4" />
        ) : (
          <ChevronsLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export function DashboardSidebar() {
  const { sidebarCollapsed, sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r bg-card transition-all duration-200",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-3 left-3 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>
    </>
  );
}
