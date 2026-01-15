import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-300">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className={contentClassName}>
        <div className="text-2xl font-bold text-white">{value}</div>
        {(subtitle || trend) && (
          <p className="text-xs text-slate-400 flex items-center">
            {trend && (
              <span
                className={cn(
                  "mr-1",
                  trend.direction === "up" ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.value}
              </span>
            )}
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
}