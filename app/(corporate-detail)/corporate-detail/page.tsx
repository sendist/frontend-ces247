"use client";

import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { CorporateCard } from "@/components/dashboard/corporate-detail";
import { useCorporateDetailData } from "@/hooks/use-corporate-detail-data";
import { SlaCustomerKipCard } from "@/components/dashboard/corporate-kips";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-11-01"),
    to: addDays(new Date("2025-11-01"), 7),
  });

  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // 3. Debounce Logic: Wait 500ms after typing stops before updating query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 500);

    return () => clearTimeout(timer);
  }, [inputValue]);

  const { corporateDetail, companyKips, isLoadingKips, isLoadingCorporate } = useCorporateDetailData({
    dateRange,
    search: debouncedSearch,
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Corporate Detail
        </h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>


        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        
          {/* Change col-span based on your layout needs */}
          <div className="grid grid-cols-1 gap-2">
                {isLoadingCorporate ? (
        <p className="text-slate-500 col-span-full text-center py-10">
          Loading dashboard data...
        </p>
      ) : (
            <div className="flex flex-col gap-4">
              <CorporateCard
                isVip={true}
                overSlaCount={corporateDetail?.vip?.stats.over3h}
                openCount={corporateDetail?.vip?.stats.openTickets}
                topCorporates={corporateDetail?.vip.topCorps}
              />
              <CorporateCard
                isVip={false}
                overSlaCount={corporateDetail?.pareto?.stats.over3h}
                openCount={corporateDetail?.pareto?.stats.openTickets}
                topCorporates={corporateDetail?.pareto.topCorps}
              />
            </div>
                  )}
          </div>

          <SlaCustomerKipCard data={companyKips} searchTerm={inputValue} onSearchChange={setInputValue} isLoading={isLoadingKips} />
        </div>

    </div>
  );
}
