"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  CorporateDetailResponse,
  CompanyKipsResponse,
} from "@/types/dashboard";

interface UseDashboardProps {
  dateRange?: {
    from?: string;
    to?: string;
  };
  search?: string;
  page?: number;
  limit?: number;
}

export function useCompanyKipsData({
  dateRange,
  search,
  page,
  limit,
}: UseDashboardProps) {
  // Helper to format dates for API (assuming API takes YYYY-MM-DD)
  const queryParams = {
    startDate: dateRange?.from ? dateRange.from : undefined,
    endDate: dateRange?.to ? dateRange.to : undefined,
    search: search || undefined,
    page: page ? page : undefined,
    limit: limit ? limit : undefined,
  };

  const companyKipsQuery = useQuery({
    queryKey: ["dashboard", "company-kips", queryParams],
    queryFn: async () => {
      const { data } = await api.get<CompanyKipsResponse>(
        "/dashboard/company-kips",
        {
          params: queryParams,
        },
      );
      return data;
    },
  });

  return {
    companyKips: companyKipsQuery.data,
    isLoadingKips: companyKipsQuery.isLoading,
    isError: companyKipsQuery.isError,
    totalCount: companyKipsQuery.data?.meta?.total,
    refetch: () => {
      companyKipsQuery.refetch();
    },
  };
}
