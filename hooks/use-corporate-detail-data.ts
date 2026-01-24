"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import {
  DashboardSummary,
  ChannelData,
  CorporateDetailResponse,
  CompanyKips,
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

export function useCorporateDetailData({
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

  const corporateDetailQuery = useQuery({
    queryKey: ["dashboard", "corporate-detail", queryParams],
    queryFn: async () => {
      const { data } = await api.get<CorporateDetailResponse>(
        "/dashboard/vip-pareto",
        {
          params: queryParams,
        },
      );
      return data;
    },
  });

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
    corporateDetail: corporateDetailQuery.data,
    companyKips: companyKipsQuery.data,
    isLoadingCorporate: corporateDetailQuery.isLoading,
    isLoadingKips: companyKipsQuery.isLoading,
    isError: corporateDetailQuery.isError || companyKipsQuery.isError,
    totalCount: companyKipsQuery.data?.meta?.total,
    refetch: () => {
      corporateDetailQuery.refetch();
      companyKipsQuery.refetch();
    },
  };
}
