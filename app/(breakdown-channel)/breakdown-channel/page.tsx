"use client";

import { TopRow } from "@/components/dashboard/top-row";
import { LeftColumn } from "@/components/dashboard/left-column";
import { ChannelColumn } from "@/components/dashboard/channel-column";
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
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { ChannelData } from "@/types/dashboard"; // Ensure this is imported
import { ChannelBreakdown } from "@/components/dashboard/channel-breakdown";
import { fromZonedTime } from "date-fns-tz";
import { DataTable } from "@/components/dashboard/data-table";
import { EscalationCard } from "@/components/dashboard/escalation-widget";

// Helper to map backend string to Icon
const getChannelIcon = (channelName: string) => {
  const normalized = channelName.toLowerCase();
  if (normalized.includes("email")) return <Mail className="text-red-500" />;
  if (normalized.includes("whatsapp"))
    return <MessageCircle className="text-green-500" />;
  if (normalized.includes("social"))
    return <Instagram className="text-pink-500" />;
  if (normalized.includes("chat"))
    return <MessageSquare className="text-orange-500" />;
  if (normalized.includes("call") || normalized.includes("188"))
    return <Phone className="text-blue-500" />;
  return <Globe className="text-slate-500" />;
};

const columns = [
  { key: "name", label: "Date" },
  { key: "total", label: "ID Ticket" },
  { key: "ticket", label: "Duration" },
  { key: "pctFcr", label: "act_name" },
];

const dummy = [
  {
    name: "Permintaan PDF Billing",
    total: 14,
    ticket: 0,
    pctFcr: "64.29",
  },
  {
    name: "Permintaan aktivasi paket",
    total: 10,
    ticket: 0,
    pctFcr: "100",
  },
  {
    name: "Informasi Cara Berlangganan",
    total: 8,
    ticket: 0,
    pctFcr: "100",
  },
  {
    name: "Re-aktivasi",
    total: 7,
    ticket: 0,
    pctFcr: "100",
  },
  {
    name: "Aktivasi kartu SIM",
    total: 6,
    ticket: 0,
    pctFcr: "100",
  },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
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
  const { summary, channels, isLoading } = useDashboardData({
    dateRange: normalizedDateRange,
  });

  // CONFIG: Define the specific order and matching logic
  const orderedLayout = [
    {
      label: "Email",
      matcher: (s: string) => s.includes("email"),
    },
    {
      label: "Whatsapp",
      matcher: (s: string) => s.includes("whatsapp") || s.includes("wa"),
    },
    {
      label: "Social Media",
      matcher: (s: string) =>
        s.includes("social") || s.includes("instagram") || s.includes("ig"),
    },
    {
      label: "Live Chat",
      matcher: (s: string) => s.includes("chat") || s.includes("live"),
    },
    {
      label: "Call Center 188",
      matcher: (s: string) => s.includes("call") || s.includes("188"),
    },
  ];

  // LOGIC: Merge API data into the fixed layout
  // We explicitly type 'processedChannels' to ensure TS is happy
  const processedChannels = orderedLayout.map((layout) => {
    // 1. Try to find the matching channel in the API response
    const foundData = channels?.find((c) =>
      layout.matcher(c.channel.toLowerCase()),
    );

    // 2. If found, return it. If NOT found, return a "Ghost" object with 0 values.
    if (foundData) {
      return { ...foundData, channel: layout.label }; // Ensure label matches our desired display name
    }

    return {
      channel: layout.label,
      pctSla: "0",
      open: 0,
      closed: 0,
      connOpen: 0,
      solOpen: 0,
      connOver3h: 0,
      solOver6h: 0,
      pctFcr: "0",
      pctNonFcr: "0",
      pctPareto: "0",
      pctNotPareto: "0",
    } as unknown as ChannelData; // Cast to satisfy Type requirements
  });

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-slate-200 mt-12 md:mt-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-2 md:space-y-0 mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Ticket Breakdown Channel
        </h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Change col-span based on your layout needs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 col-span-7 gap-2">
          {isLoading ? (
            <p className="text-slate-500 col-span-full text-center py-10">
              Loading dashboard data...
            </p>
          ) : (
            // Render the processed list instead of the raw API list
            processedChannels.map((channel, index) => (
              <ChannelBreakdown
                key={index}
                icon={getChannelIcon(channel.channel)}
                title={channel.channel}
                sla={`${channel.pctSla}%`}
                open={channel.open}
                closed={channel.closed}
                connOpen={channel.connOpen}
                solOpen={channel.solOpen}
                connOver3h={channel.connOver3h}
                solOver6h={channel.solOver6h}
                pctFcr={channel.pctFcr}
                pctNonFcr={channel.pctNonFcr}
                pctPareto={channel.pctPareto}
                pctNotPareto={channel.pctNotPareto}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-4">
        <EscalationGrid dateRange={normalizedDateRange} />
      </div>
    </div>
  );
}

const EBO_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "idTicket", label: "ID Ticket" },
  { key: "idCase", label: "ID Case" },
  { key: "duration", label: "Duration" },
  { key: "act_name", label: "act_name" },
  { key: "unit_id", label: "unit_id" },
];

const BILLCO_COLUMNS = [
  { key: "date", label: "Date" },
  { key: "idTicket", label: "ID Ticket" },
  { key: "kip", label: "KIP" },
  { key: "lob", label: "LOB" },
];

function EscalationGrid({
  dateRange,
}: {
  dateRange?: {
    from?: string;
    to?: string;
  };
}) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-2 ">
      <EscalationCard
        className="col-span-3"
        title="EBO"
        type="ebo"
        apiUrl="/dashboard/ebo-escalation"
        dateRange={dateRange}
        columns={EBO_COLUMNS}
      />
      <EscalationCard
        className="col-span-3"
        title="GTM"
        type="gtm"
        apiUrl="/dashboard/gtm-escalation"
        dateRange={dateRange}
        columns={EBO_COLUMNS}
      />
      <EscalationCard
        className="col-span-2"
        title="Billco"
        type="billco"
        apiUrl="/dashboard/billco-escalation"
        dateRange={dateRange}
        columns={BILLCO_COLUMNS}
      />
      <EscalationCard
        className="col-span-2"
        title="IT"
        type="it"
        apiUrl="/dashboard/it-escalation"
        dateRange={dateRange}
        columns={[
          { key: "date", label: "Date" },
          { key: "idTicket", label: "ID Ticket" },
          { key: "idRemedy", label: "ID Remedy" },
          { key: "duration", label: "Duration" },
        ]}
      />
    </div>
  );
}
