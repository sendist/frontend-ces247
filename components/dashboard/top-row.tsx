"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, TrendingDown, AlertCircle } from "lucide-react";
import { MetricCard } from "./metric-card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DashboardSummary } from "@/types/dashboard";

const dailyTrendData = [
  { name: "1", value: 1000 },
  { name: "3", value: 1200 },
  { name: "5", value: 800 },
  { name: "7", value: 1800 },
  { name: "9", value: 1500 },
  { name: "11", value: 1900 },
  { name: "13", value: 1200 },
  { name: "15", value: 1700 },
  { name: "17", value: 1400 },
  { name: "19", value: 1900 },
];

const ticketsPerHourData = [
  { name: "00:00", created: 8, solved: 6 },
  { name: "03:00", created: 9, solved: 5 },
  { name: "06:00", created: 12, solved: 8 },
  { name: "09:00", created: 15, solved: 10 },
  { name: "12:00", created: 10, solved: 7 },
  { name: "15:00", created: 11, solved: 9 },
  { name: "18:00", created: 4, solved: 3 },
  { name: "21:00", created: 2, solved: 1 },
];

interface TopRowProps {
  summary?: DashboardSummary;
}

export function TopRow({ summary }: TopRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4 mb-4">
      <MetricCard
        title="SLA Today"
        value={summary ? `${summary.slaPercentage}%` : "..."}
        subtitle="Achieved"
        trend={{ value: "1%", direction: "down" }}
        icon={<CheckCircle className="h-6 w-6 text-green-500" />}
        className="bg-green-900/20 border-green-900/50 "
        contentClassName="text-green-500"
      />

      <Card className="bg-slate-800 border-slate-700 col-span-1 lg:col-span-2">
        <CardHeader className="pb-2 -m-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Daily Trend
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pb-0 pt-0 -m-4">
          <div className="h-[80px] overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyTrendData} className="-ml-6">
              <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                />
                <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                />
                <YAxis 
                    stroke="#94a3b8"
                    padding={{ top: 0, bottom: 0 }}
                    fontSize={8} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `${value}`} 
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
                {/* <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '5px' }} /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
          {/* <p className="text-xs text-center text-slate-400 mt-1">
            Ticket Trend
          </p> */}
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700 col-span-1 lg:col-span-2">
        <CardHeader className="pb-2 -m-2">
          <CardTitle className="text-sm font-medium text-slate-300">
            Tickets
            <span className="ml-2 text-xs font-normal text-slate-400">
              Per hour
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="-m-2">
          <div className="h-[24px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ticketsPerHourData}>
                <Bar dataKey="created" fill="#0ea5e9" />
                <Bar dataKey="solved" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-1">
            <div className="flex items-center text-xs text-slate-400">
              <div className="h-2 w-2 rounded-full bg-sky-500 mr-1"></div>
              Created
            </div>
            <div className="flex items-center text-xs text-slate-400">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mr-1"></div>
              Solved
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-2 col-span-1 lg:col-span-3">
        <MetricCard
          title="Created today"
          value={summary ? summary.totalTickets.toLocaleString() : "..."}
          trend={{ value: "18", direction: "up" }}
          subtitle="vs last week"
          className="col-span-1"
        />
        <MetricCard title="Open tickets" value={summary ? summary.totalOpen.toLocaleString() : "..."} className="col-span-1" />
        <MetricCard
          title="Unassigned"
          value="..."
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          className="col-span-1 bg-red-900/20 border-red-900/50"
        />
      </div>
    </div>
  );
}
