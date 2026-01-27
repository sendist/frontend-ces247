import { useState, useEffect } from "react";
import api from "@/lib/api";

interface EscalationResponse {
  data: any[];
  summary: { totalOpen: number; over3H: number };
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

interface UseEscalationProps {
  url: string;
  page?: number;
  search?: string;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export function useEscalationData(apiUrl: string, page: number, search: string, {
 dateRange
}: UseEscalationProps) {
  const queryParams = {
    startDate: dateRange?.from ? dateRange.from : undefined,
    endDate: dateRange?.to ? dateRange.to : undefined,
    page: page,
    search: search
  };
  const [data, setData] = useState<EscalationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(apiUrl, {
          params: queryParams,
        });
        setData(response.data);
      } catch (error) {
        console.error(`Error fetching from ${apiUrl}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [apiUrl, page, search]);

  return { data, isLoading };
}
