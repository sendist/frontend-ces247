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
import { Network } from "lucide-react"; // Icon for Connectivity
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
import { ProductDetail, ProductDetailResponse } from "@/types/dashboard";

interface ProductDetailProps {
  product: String;
  data: ProductDetail;
}

export function ProductCard({ product, data }: ProductDetailProps) {
  // Filter for CONNECTIVITY data
  //   const connectivityData = useMemo(() => {
  //     return data.find((item) => item.product === "CONNECTIVITY");
  //   }, [data]);
  const connectivityData = data;

  if (!connectivityData) return <div>No Connectivity Data Found</div>;

  // --- Process Trend Data for Chart ---
  // Convert "2025-02-01" -> "1"
  const chartData = useMemo(() => {
    return connectivityData.trend.map((item) => ({
      name: parseInt(item.date.split("-")[2]).toString(), // Extract day
      total: item.total,
      sla: parseFloat(item.dailySla),
    }));
  }, [connectivityData.trend]);

  // --- Helpers for Top Section Bars ---
  const maxCategoryTotal = Math.max(
    ...connectivityData.topCategories.map((c) => c.total),
  );

  return (
    <Card className="w-full max-w-4xl border-none shadow-sm bg-gray-50/50">
      <CardHeader className="flex flex-row items-center gap-2">
        <Network className="h-6 w-6 text-md text-sky-500" />
        <CardTitle className="text-md font-bold text-slate-900">
          {product} Detail
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 -mx-4 -mt-2">
        {/* --- TOP SECTION: Categories Breakdown --- */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          {/* Header Stats */}
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

          {/* Horizontal Bar Chart Grid */}
          <div className="grid grid-cols-8 gap-1 text-xs">
            {/* Headers */}
            <div className="col-span-4 text-right font-bold text-slate-700"></div>
            <div className="col-span-2 font-bold text-slate-900">
              Total Ticket
            </div>
            <div className="col-span-2 font-bold text-slate-900">%SLA</div>

            {/* Rows */}
            {connectivityData.topCategories.map((cat, idx) => (
              <React.Fragment key={idx}>
                {/* Label */}
                <div className="col-span-4 flex items-center justify-end text-right text-xs font-semibold text-slate-600 uppercase pr-2">
                  {cat.general_category}
                </div>

                {/* Total Bar (Dark Blue) */}
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

                {/* SLA Bar (Light Blue) */}
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
          {/* Controls Header */}
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
          {/* Recharts Combo Chart */}
          <div className="h-[200px] w-full text-xs -mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
              >
                <CartesianGrid stroke="#f5f5f5" vertical={false} />

                <XAxis
                  dataKey="name"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                />

                {/* FIX 1: Control the Bar Height 
                       We set the domain max to 'dataMax * 2.5'. 
                       This means the tallest bar will only take up about 40% of the height,
                       leaving the top 60% free for the line chart.
                    */}
                <YAxis
                  yAxisId="left"
                  hide
                  domain={[0, (dataMax: number) => dataMax * 2.5]}
                />

                {/* FIX 2: Control the Line Height
                       SLA is usually 0-100. We keep it standard. 
                       Because the bars are pushed down by Fix 1, the line will float above.
                    */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  hide
                  domain={[0, 120]}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: "bold" }}
                />

                {/* Bars for Total */}
                <Bar
                  yAxisId="left"
                  dataKey="total"
                  fill="#0B1750"
                  barSize={12}
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

                {/* Line for SLA */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="sla"
                  stroke="#9ca3af"
                  strokeWidth={3}
                  dot={{ r: 3, fill: "#9ca3af", strokeWidth: 0 }}
                >
                  <LabelList
                    dataKey="sla"
                    position="top"
                    offset={10}
                    formatter={(val) => `${val}%`}
                    style={{ fill: "#6b7280", fontSize: "8px" }}
                  />
                </Line>
              </ComposedChart>
            </ResponsiveContainer>

            {/* Legend */}
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
