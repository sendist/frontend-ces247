import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { TopItem } from "@/types/dashboard";

interface ChannelColumnProps {
  icon: React.ReactNode;
  title: string;
  sla: string;
  open: number;
  closed: number;
  topCorporateData: TopItem[];
  topKipData: TopItem[];
  isLoading?: boolean; // <--- NEW PROP
}

const columns = [
  { key: "name", label: "Nama Perusahaan" },
  { key: "total", label: "Interaksi" },
  { key: "ticket", label: "Tiket" },
  { key: "pctFcr", label: "%FCR" },
];

export function ChannelColumn({
  icon,
  title,
  sla,
  open,
  closed,
  topCorporateData,
  topKipData,
  isLoading = false, // Default to false
}: ChannelColumnProps) {
  // 1. RENDER SKELETON STATE
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        {/* Top Card Skeleton */}
        <Card className="dark:bg-slate-800/50 dark:border-slate-700/50">
          <CardHeader className="flex flex-row items-center space-y-0 pb-0 -mt-2">
            {/* Icon Circle */}
            <div className="h-6 w-6 rounded-full dark:bg-slate-700" />
            {/* Title Bar */}
            <div className="h-5 w-24 dark:bg-slate-700 rounded ml-2" />
          </CardHeader>
          <CardContent className="flex justify-between text-center px-4 pt-4 pb-2">
            {/* 3 Stat Pillars */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-3 w-8 dark:bg-slate-700 rounded" />
                <div className="w-16 h-8 dark:bg-slate-700 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Corporate Table Skeleton */}
        <div className="rounded-md border dark:border-slate-700/50 dark:bg-slate-800/50 p-4 space-y-3">
          <div className="h-4 w-1/3 dark:bg-slate-700 rounded mb-4" />
          <div className="h-8 w-full dark:bg-slate-700/50 rounded" />
          <div className="h-8 w-full dark:bg-slate-700/50 rounded" />
        </div>

        {/* Top KIP Table Skeleton */}
        <div className="rounded-md border dark:border-slate-700/50 dark:bg-slate-800/50 p-4 space-y-3">
          <div className="h-4 w-1/3 dark:bg-slate-700 rounded mb-4" />
          <div className="h-8 w-full dark:bg-slate-700/50 rounded" />
        </div>
      </div>
    );
  }

  // 2. RENDER REAL STATE (Your original code)
  return (
    <div className="flex flex-col">
      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center space-y-0 pb-0 -mt-2">
          {icon}
          <CardTitle className="text-md font-bold ml-2 leading-none">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between text-center px-4 pt-0 -mt-2 -mb-2">
          {/* SLA - Green Section */}
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              SLA
            </p>
            <div className="bg-green-100 text-green-700 border-green-500 dark:bg-green-900/50 dark:text-green-500 font-bold rounded-full w-16 h-8 flex items-center justify-center text-sm border-2 transition-colors">
              {sla}
            </div>
          </div>

          {/* Open - Red Section */}
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Open
            </p>
            <div className="bg-red-100 text-red-700 border-red-500 dark:bg-red-900/50 dark:text-red-500 font-bold rounded-full w-16 h-8 flex items-center justify-center text-sm border-2 transition-colors">
              {open}
            </div>
          </div>

          {/* Closed - Blue Section */}
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
              Closed
            </p>
            <div className="bg-blue-100 text-blue-700 border-blue-500 dark:bg-blue-900/50 dark:text-blue-500 font-bold rounded-full w-16 h-8 flex items-center justify-center text-sm border-2 transition-colors">
              {closed}
            </div>
          </div>
        </CardContent>
      </Card>

      <DataTable
        title="Top Corporate"
        data={topCorporateData}
        columns={columns}
      />
      <DataTable title="Top KIP" data={topKipData} columns={columns} />
    </div>
  );
}
