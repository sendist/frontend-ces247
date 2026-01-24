import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Triangle } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: { value: string; direction: "up" | "down" };
  className?: string;
  contentClassName?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  className,
  contentClassName,
}: MetricCardProps) {
  return (
    <Card className={cn("bg-slate-800 border-slate-700", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 -m-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className={contentClassName}>
        <div className="text-2xl font-bold text-white -mt-4 mb-2">{value}</div>
        {(subtitle || trend) && (
          <div>
            <p className="text-xs text-slate-400 flex items-center">
              {trend && (
                <span
                  className={cn(
                    "mr-1 flex items-center", // Added flex to align icon and text
                    trend.direction === "up"
                      ? "text-green-500"
                      : "text-red-500",
                  )}
                >
                  <Triangle
                    className={cn(
                      "h-3 w-3 mr-1 fill-current", // fill-current makes the triangle solid
                      trend.direction === "down" && "rotate-180", // Flip it if down
                    )}
                  />
                  {trend.value}
                </span>
              )}
            </p>
            <p className="text-xs text-slate-400 flex items-center">
              {subtitle}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
