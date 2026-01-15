"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Newspaper, 
  LogOut, 
  PlusCircle,
  List,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: async () => api.post("/auth/logout"),
    onSuccess: () => {
      // Clear all cache to remove user data
      queryClient.clear(); 
      toast("Logged out");
      router.push("/login");
    },
  });

  // Navigation Links
  const links = [
    {
      title: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      roles: ["USER", "ADMIN"],
    },
    {
      title: "My Posts",
      href: "/my-posts",
      icon: List,
      roles: ["USER"],
    },
    {
      title: "Create Post",
      href: "/my-posts/create",
      icon: PlusCircle,
      roles: ["USER"],
    },
    {
      title: "Manage Users",
      href: "/admin/users",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      title: "Manage All Posts",
      href: "/admin/posts",
      icon: FileText,
      roles: ["ADMIN"],
    },
    {
      title: "feed",
      href: "/feed",
      icon: Newspaper,
      roles: ["USER"],
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div 
        className={cn(
          "relative flex h-screen flex-col justify-between border-r bg-gray-50/40 p-4 dark:bg-gray-900/40 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Collapse Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent z-50"
          onClick={toggleSidebar}
        >
          {isCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>

        <div className="space-y-4">
          <div className={cn("px-2 py-2 flex items-center", isCollapsed ? "justify-center" : "")}>
            <h2 className={cn("text-lg font-semibold tracking-tight transition-all duration-300", isCollapsed ? "hidden" : "block px-4")}>
              CES247
            </h2>
            {isCollapsed && <span className="text-lg font-bold">C</span>}
          </div>
          
          {!isCollapsed && (
            <p className="px-6 text-xs text-muted-foreground truncate">
              Welcome, {user?.name}
            </p>
          )}
          
          <nav className="space-y-1">
            {links.map((link) => {
              // Hide link if user role doesn't match
              if (user && !link.roles.includes(user.role)) return null;

              const Icon = link.icon;
              const isActive = pathname === link.href;

              return isCollapsed ? (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground mx-auto",
                        isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="sr-only">{link.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="flex items-center gap-4">
                    {link.title}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {link.title}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="px-2 py-2">
            {isCollapsed ? (
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button 
                            variant="ghost"
                            size="icon" 
                            className="h-9 w-9 mx-auto flex justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => logoutMutation.mutate()}
                            disabled={logoutMutation.isPending}
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="sr-only">Logout</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
            ) : (
                <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    {logoutMutation.isPending ? "Logging out..." : "Logout"}
                </Button>
            )}
        </div>
      </div>
    </TooltipProvider>
  );
}