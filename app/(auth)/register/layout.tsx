"use client";

import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If not logged in, useAuth redirects to /login automatically.
  const { user, isLoading } = useAuth(true);

  if (user?.role !== "ADMIN")
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 p-4 dark:bg-black">
        <div className="text-white text-xl font-medium">Access Denied</div>
      </div>
    );
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y bg-slate-50 p-4 dark:bg-slate-950">
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="w-full max-w-md px-4">{children}</div>
        </div>
      </main>
    </div>
  );
}
