"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";
import {
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
} from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number; // This is the center float (e.g., 4.2)
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
  contentClassName?: string;
  showChart?: boolean;
  chartColor?: string;
}

export function CsatMetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  contentClassName,
  showChart = false,
  chartColor = "#3b82f6", // Default blue-500
}: MetricCardProps) {
  // Logic for the gauge: map 1-5 scale to 0-100%
  const numericValue = typeof value === "string" ? parseFloat(value) : value;
  const chartData = [{ value: (numericValue / 5) * 100 }];

  return (
    <Card
      className={cn(
        "dark:bg-slate-800 dark:border-slate-700 overflow-hidden",
        className,
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 -m-2">
        <CardTitle className="text-xs font-medium dark:text-slate-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent
        className={cn("relative flex flex-col items-start", contentClassName)}
      >
        <div className="flex flex-col w-full items-center justify-between -mt-2">
          {/* Radial Chart Container */}
          {showChart && (
            <div className="h-[60px] w-[60px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="110%"
                  data={chartData}
                  startAngle={225} // 270 degree arc starts here
                  endAngle={-45}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "#334155" }} // slate-700 background
                    dataKey="value"
                    cornerRadius={10}
                    fill={chartColor}
                  />
                  {/* Center Text */}
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="dark:fill-white text-[10px] font-bold"
                  >
                    {`${Math.round((numericValue / 5) * 100)}%`}
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="z-10">
            <div className="text-sm font-bold dark:text-white">{value}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
