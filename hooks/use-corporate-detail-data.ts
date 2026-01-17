"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DashboardSummary, ChannelData, CorporateDetailResponse } from "@/types/dashboard";

interface UseDashboardProps {
  dateRange?: DateRange;
}

export function useCorporateDetailData({ dateRange }: UseDashboardProps) {
  // Helper to format dates for API (assuming API takes YYYY-MM-DD)
  const queryParams = {
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const corporateDetailQuery = useQuery({
    queryKey: ["dashboard", "corporate-detail", queryParams],
    queryFn: async () => {
      const { data } = await api.get<CorporateDetailResponse>("/dashboard/vip-pareto", {
        params: queryParams,
      });
      return data;
    },
  });

  const companyKipsQuery = useQuery({
    queryKey: ["dashboard", "company-kips", queryParams],
    queryFn: async () => {
      const { data } = await api.get<ChannelData[]>("/dashboard/company-kips", {
        params: queryParams,
      });
      return data;
    },
  });

  return {
    corporateDetail: corporateDetailQuery.data,
    companyKips: companyKipsQuery.data,
    isLoading: corporateDetailQuery.isLoading || companyKipsQuery.isLoading,
    isError: corporateDetailQuery.isError || companyKipsQuery.isError,
    refetch: () => {
      corporateDetailQuery.refetch();
      companyKipsQuery.refetch();
    },
  };
}
