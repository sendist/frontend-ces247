"use client";

import { TopRow } from "@/components/dashboard/top-row";
import { LeftColumn } from "@/components/dashboard/left-column";
import { ChannelColumn } from "@/components/dashboard/channel-column";
import { Mail, MessageCircle, Instagram, MessageSquare, Phone, Globe } from "lucide-react";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { addDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { ChannelData } from "@/types/dashboard"; // Ensure this is imported
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown";
import { CorporateCard } from "@/components/dashboard/corporate-detail";
import { useCorporateDetailData } from "@/hooks/use-corporate-detail-data";
import { SlaCustomerKipCard } from "@/components/dashboard/corporate-kips";

// Helper to map backend string to Icon
const getChannelIcon = (channelName: string) => {
  const normalized = channelName.toLowerCase();
  if (normalized.includes("email")) return <Mail className="text-red-500" />;
  if (normalized.includes("whatsapp")) return <MessageCircle className="text-green-500" />;
  if (normalized.includes("social")) return <Instagram className="text-pink-500" />;
  if (normalized.includes("chat")) return <MessageSquare className="text-orange-500" />;
  if (normalized.includes("call") || normalized.includes("188")) return <Phone className="text-blue-500" />;
  return <Globe className="text-slate-500" />;
};

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date("2025-11-01"),
    to: addDays(new Date("2025-11-01"), 7),
  });

  const { corporateDetail, companyKips, isLoading } = useCorporateDetailData({ dateRange });

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">Corporate Detail</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

 
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        {/* Change col-span based on your layout needs */}
        <div className="grid grid-cols-1 gap-2">
          {isLoading ? (
             <p className="text-slate-500 col-span-full text-center py-10">Loading dashboard data...</p>
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

        <SlaCustomerKipCard />
      </div>
    </div>
  );
}