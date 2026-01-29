"use client";

import {
  Mail,
  MessageCircle,
  Instagram,
  MessageSquare,
  Phone,
  Globe,
} from "lucide-react";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { addDays, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { ProductCard } from "@/components/dashboard/product-detail";
import { useProductDetailData } from "@/hooks/use-product-detail-data";
import { fromZonedTime } from "date-fns-tz";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date(),
  });

  const normalizedDateRange = useMemo(() => {
    if (!dateRange?.from) return undefined;

    const tz = "Asia/Jakarta";

    const fromLocal = startOfDay(dateRange.from);
    const toLocal = dateRange.to
      ? addDays(startOfDay(dateRange.to), 1)
      : addDays(fromLocal, 1);

    return {
      from: fromZonedTime(fromLocal, tz).toISOString(),
      to: fromZonedTime(toLocal, tz).toISOString(),
    };
  }, [dateRange]);
  const { productDetail, isLoading } = useProductDetailData({
    dateRange: normalizedDateRange,
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Product Detail
        </h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 2xl:grid-cols-8 gap-4">
        <ProductCard
          className="col-span-1 lg:col-span-3"
          product="Connectivity"
          isLoading={isLoading}
          data={
            productDetail?.find((item) => item.product === "CONNECTIVITY") ?? {
              product: "CONNECTIVITY",
              total: 0,
              open: 0,
              over3h: 0,
              pctSla: "0%",
              topKips: [],
              topCategories: [],
              trend: [],
            }
          }
        />
        <ProductCard
          className="col-span-1 lg:col-span-3"
          product="Solution"
          isLoading={isLoading}
          data={
            productDetail?.find((item) => item.product === "SOLUTION") ?? {
              product: "SOLUTION",
              total: 0,
              open: 0,
              over3h: 0,
              pctSla: "0%",
              topKips: [],
              topCategories: [],
              trend: [],
            }
          }
        />
        <ProductCard
          className="col-span-1 lg:col-span-2"
          product="DAds"
          isLoading={isLoading}
          data={
            productDetail?.find((item) => item.product === "DADS") ?? {
              product: "DADS",
              total: 0,
              open: 0,
              over3h: 0,
              pctSla: "0%",
              topKips: [],
              topCategories: [],
              trend: [],
            }
          }
        />
      </div>
    </div>
  );
}
