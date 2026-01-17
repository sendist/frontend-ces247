"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { DashboardSummary, ChannelData, CorporateDetailResponse, ProductDetailResponse, ProductDetail } from "@/types/dashboard";

interface UseDashboardProps {
  dateRange?: DateRange;
}

export function useProductDetailData({ dateRange }: UseDashboardProps) {
  // Helper to format dates for API (assuming API takes YYYY-MM-DD)
  const queryParams = {
    startDate: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    endDate: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const productDetailQuery = useQuery({
    queryKey: ["dashboard", "product-detail", queryParams],
    queryFn: async () => {
      const { data } = await api.get<ProductDetail[]>("/dashboard/products", {
        params: queryParams,
      });
      return data;
    },
  });

  return {
    productDetail: productDetailQuery.data,
    isLoading: productDetailQuery.isLoading || productDetailQuery.isLoading,
    isError: productDetailQuery.isError || productDetailQuery.isError,
    refetch: () => {
      productDetailQuery.refetch();
    },
  };
}
