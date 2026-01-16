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

  const { summary, channels, isLoading } = useDashboardData({ dateRange });

  // CONFIG: Define the specific order and matching logic
  const orderedLayout = [
    { 
      label: "Email", 
      matcher: (s: string) => s.includes("email") 
    },
    { 
      label: "Whatsapp", 
      matcher: (s: string) => s.includes("whatsapp") || s.includes("wa") 
    },
    { 
      label: "Social Media", 
      matcher: (s: string) => s.includes("social") || s.includes("instagram") || s.includes("ig") 
    },
    { 
      label: "Live Chat", 
      matcher: (s: string) => s.includes("chat") || s.includes("live") 
    },
    { 
      label: "Call Center 188", 
      matcher: (s: string) => s.includes("call") || s.includes("188") 
    },
  ];

  // LOGIC: Merge API data into the fixed layout
  // We explicitly type 'processedChannels' to ensure TS is happy
  const processedChannels = orderedLayout.map((layout) => {
    // 1. Try to find the matching channel in the API response
    const foundData = channels?.find((c) => layout.matcher(c.channel.toLowerCase()));

    // 2. If found, return it. If NOT found, return a "Ghost" object with 0 values.
    if (foundData) {
      return { ...foundData, channel: layout.label }; // Ensure label matches our desired display name
    }

    return {
      channel: layout.label,
      pctSla: "0",
      open: 0,
      closed: 0,
      topCorporate: [],
      topKip: [],
    } as unknown as ChannelData; // Cast to satisfy Type requirements
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <TopRow summary={summary} />
      
      <div className="grid grid-cols-1 xl:grid-cols-8 gap-4">
        <LeftColumn summary={summary} />

        {/* Change col-span based on your layout needs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-7 gap-2">
          {isLoading ? (
             <p className="text-slate-500 col-span-full text-center py-10">Loading dashboard data...</p>
          ) : (
            // Render the processed list instead of the raw API list
            processedChannels.map((channel, index) => (
              <ChannelColumn
                key={index}
                icon={getChannelIcon(channel.channel)}
                title={channel.channel}
                sla={`${channel.pctSla}%`}
                open={channel.open}
                closed={channel.closed}
                topCorporateData={channel.topCorporate}
                topKipData={channel.topKip}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}