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
}

export function useCorporateDetailData({
  dateRange,
}: UseDashboardProps) {
  // Helper to format dates for API (assuming API takes YYYY-MM-DD)
  const queryParams = {
    startDate: dateRange?.from ? dateRange.from : undefined,
    endDate: dateRange?.to ? dateRange.to : undefined,
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

  return {
    corporateDetail: corporateDetailQuery.data,
    isLoadingCorporate: corporateDetailQuery.isLoading,
    isError: corporateDetailQuery.isError ,
    refetch: () => {
      corporateDetailQuery.refetch();
    },
  };
}
