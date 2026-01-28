"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HandHeart, Network, Smartphone } from "lucide-react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { cn } from "@/lib/utils";
import { ProductDetail } from "@/types/dashboard";

interface ProductDetailProps {
  product: String;
  data: ProductDetail;
  isLoading?: boolean; // <--- NEW PROP
  className?: string;
}

export function ProductCard({
  product,
  data,
  isLoading = false,
  className,
}: ProductDetailProps) {
  // 1. SKELETON RENDER (Shows when isLoading is true)
  if (isLoading) {
    return (
      <Card className={cn("w-full max-w-4xl border-none shadow-sm bg-gray-50/50", className)}>
        <CardHeader className="flex flex-row items-center gap-2">
          {/* Icon Skeleton */}
          <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse" />
          {/* Title Skeleton */}
          <div className="h-5 w-32 bg-slate-200 rounded animate-pulse" />
        </CardHeader>

        <CardContent className="space-y-4 -mx-4 -mt-2">
          {/* TOP SECTION SKELETON */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex gap-4 mb-4">
              <div className="h-12 w-24 bg-slate-100 rounded-md animate-pulse" />
              <div className="h-12 w-24 bg-slate-100 rounded-md animate-pulse" />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-2 items-center">
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse ml-auto" />
                  <div className="h-5 w-full max-w-[200px] bg-slate-200 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* MIDDLE SECTION SKELETON */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <div className="h-10 w-16 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-10 w-16 bg-slate-200 rounded-lg animate-pulse" />
              </div>
              <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
            </div>
            <div className="h-[180px] w-full bg-slate-50 rounded animate-pulse" />
          </div>

          {/* BOTTOM SECTION SKELETON */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <div className="h-10 bg-slate-200 animate-pulse w-full" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-8 bg-white border-b border-gray-100 animate-pulse"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 2. REAL RENDER (Existing Logic)
  const connectivityData = data;

  if (!connectivityData) return <div>No Connectivity Data Found</div>;

  const chartData = useMemo(() => {
    return connectivityData.trend.map((item) => ({
      name: parseInt(item.date.split("-")[2]).toString(),
      total: item.total,
      sla: parseFloat(item.dailySla),
    }));
  }, [connectivityData.trend]);

  const maxCategoryTotal =
    Math.max(...connectivityData.topCategories.map((c) => c.total)) || 1; // Prevent division by zero

  return (
    <Card className={cn("w-full max-w-4xl border-none shadow-sm bg-gray-50/50", className)}>
      <CardHeader className="flex flex-row items-center gap-2">
        {getProductIcon(product)}{" "}
        <CardTitle className="text-md font-bold text-slate-900">
          {product} Detail
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 -mx-4 -mt-2">
        {/* --- TOP SECTION: Categories Breakdown --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex gap-4 mb-4">
            <div className="bg-gray-200 px-3 py-1 rounded-md">
              <span className="text-xs font-bold text-slate-500 block">
                Total Ticket
              </span>
              <span className="text-sm font-bold text-slate-700">
                {connectivityData.total.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="bg-gray-200 px-3 py-1 rounded-md">
              <span className="text-xs font-bold text-slate-500 block">
                %SLA ALL
              </span>
              <span className="text-sm font-bold text-slate-700">
                {connectivityData.pctSla}%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-8 gap-1 text-xs">
            <div className="col-span-4 text-right font-bold text-slate-700"></div>
            <div className="col-span-2 font-bold text-slate-900">
              Total Ticket
            </div>
            <div className="col-span-2 font-bold text-slate-900">%SLA</div>

            {connectivityData.topCategories.map((cat, idx) => (
              <React.Fragment key={idx}>
                <div className="col-span-4 flex items-center justify-end text-right text-xs font-semibold text-slate-600 uppercase pr-2">
                  {cat.general_category}
                </div>
                <div className="col-span-2 flex items-center">
                  <div
                    className="h-5 bg-[#0B1750] rounded-sm transition-all duration-500"
                    style={{
                      width: `${(cat.total / maxCategoryTotal) * 80}%`,
                      minWidth: "4px",
                    }}
                  />
                  <span className="ml-2 text-xs font-bold text-slate-800">
                    {cat.total}
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <div
                    className="h-5 bg-[#bfdbfe] rounded-sm transition-all duration-500"
                    style={{ width: `${parseFloat(cat.catSla)}%` }}
                  />
                  <span className="ml-2 text-xs font-bold text-slate-800">
                    {cat.catSla}%
                  </span>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* --- MIDDLE SECTION: Trend Chart --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm relative">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-2">
              <div className="bg-[#0B1750] text-white px-4 py-2 rounded-lg text-center min-w-[70px]">
                <div className="text-[10px] font-bold">Open</div>
                <div className="text-sm font-bold">{connectivityData.open}</div>
              </div>
              <div className="bg-[#0B1750] text-white px-4 py-2 rounded-lg text-center min-w-[70px]">
                <div className="text-[10px] font-bold">&gt;3H</div>
                <div className="text-sm font-bold">
                  {connectivityData.over3h}
                </div>
              </div>
            </div>

            <div className="w-[150px]">
              <Select defaultValue="product">
                <SelectTrigger className="h-8 bg-gray-100 border-none">
                  <SelectValue placeholder="Product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="product">Product</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="h-[200px] w-full text-xs -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false} />
                <XAxis
                  dataKey="name"
                  // scale="point"
                  padding={{ left: 10, right: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />
                <YAxis
                  yAxisId="left"
                  hide
                  domain={[0, (dataMax: number) => dataMax * 2.5]}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  hide
                  domain={[0, 120]}
                />
                <Tooltip
                  formatter={(value, name) => {
    if (name === "sla") {
      return [`${value}%`, "SLA"];
    }
    return [value, name];
  }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "bold" }}
                />
                <Bar
                  yAxisId="left"
                  dataKey="total"
                  fill="#0B1750"
                  barSize={10}
                  radius={[2, 2, 0, 0]}
                >
                  <LabelList
                    dataKey="total"
                    position="top"
                    style={{
                      fill: "#374151",
                      fontSize: "9px",
                      fontWeight: "bold",
                    }}
                  />
                </Bar>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sla"
                  stroke="#9ca3af"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#9ca3af", strokeWidth: 0 }}
                >
                  {/* <LabelList
                    dataKey="sla"
                    position="top"
                    offset={10}
                    formatter={(val: any) => `${val}%`}
                    style={{ fill: "#6b7280", fontSize: "8px" }}
                  /> */}
                </Line>
              </ComposedChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 -mt-6">
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-[#0B1750]"></div>
                <span className="text-[10px] text-slate-600">Total</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-1 bg-gray-400"></div>
                <span className="text-[10px] text-slate-600">SLA</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION: Top KIP Table --- */}
        <div className="overflow-hidden rounded-xl border border-gray-200">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#0B1750] text-white">
              <tr>
                <th className="px-4 py-2 font-semibold">Top KIP</th>
                <th className="px-4 py-2 font-semibold text-center">
                  Total Tiket
                </th>
                <th className="px-4 py-2 font-semibold text-center">%SLA</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-100 bg-blue-50/30">
              {connectivityData.topKips.map((kip, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "hover:bg-blue-50/80 transition-colors",
                    idx % 2 === 1 ? "bg-white" : "bg-blue-50/30",
                  )}
                >
                  <td
                    className="px-4 py-0.5 text-slate-700 truncate max-w-[200px]"
                    title={kip.detail_category}
                  >
                    {kip.detail_category}
                  </td>
                  <td className="px-4 py-0.5 text-center font-bold text-slate-800">
                    {kip.total}
                  </td>
                  <td className="px-4 py-0.5 text-center font-bold text-slate-800">
                    {kip.kipSla}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

const getProductIcon = (productName: String) => {
  const normalized = productName.toLowerCase();

  if (normalized.includes("connectivity")) {
    return <Network className="h-6 w-6 text-sky-500" />;
  }
  if (normalized.includes("solution")) {
    return <HandHeart className="h-6 w-6 text-emerald-500" />;
  }
  if (normalized.includes("ads") || normalized.includes("dads")) {
    return <Smartphone className="h-6 w-6 text-orange-500" />;
  }

  // Default fallback
  return <Network className="h-6 w-6 text-slate-500" />;
};
