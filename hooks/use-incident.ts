"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

// Define your interface based on the Prisma Schema
export interface IncidentReport {
  id: number;
  title: string | null;
  isActive: boolean | null;
  description: string | null;
  createdAt: string;
  solvedAt: string | null;
}

export function useIncidents(status: "active" | "inactive") {
  const queryClient = useQueryClient();

  // 1. Fetching Logic
  const query = useQuery({
    queryKey: ["incidents", status],
    queryFn: async () => {
      const { data } = await api.get<IncidentReport[]>(`/incidents/${status}`);
      return data;
    },
  });

  // 2. CREATE Logic (New)
  const createMutation = useMutation({
    mutationFn: async (newIncident: { title: string; description: string }) => {
      const { data } = await api.post<IncidentReport>(
        "/incidents",
        newIncident,
      );
      return data;
    },
    onSuccess: () => {
      // Refresh the "active" list so the new one pops up
      queryClient.invalidateQueries({ queryKey: ["incidents", "active"] });
    },
  });

  // 2. Solving Logic (Mutation)
  const solveMutation = useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch(`/incidents/${id}/solve`);
      return data;
    },
    onSuccess: () => {
      // Refresh both lists so the incident "moves" from active to inactive
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
    },
  });

  return {
    incidents: query.data ?? [],
    isLoading: query.isLoading,
    createIncident: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    solveIncident: solveMutation.mutate,
    isSolving: solveMutation.isPending,
  };
}
