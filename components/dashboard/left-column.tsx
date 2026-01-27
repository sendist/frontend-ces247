import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardSummary } from "@/types/dashboard";

const priorityData = [
  { label: "Roaming", value: 28, color: "bg-red-600" },
  { label: "Extra Quota", value: 10, color: "bg-red-600" },
  { label: "CC", value: 30, color: "bg-red-600" },
  { label: "VIP", value: 0, color: "bg-red-600" },
  { label: "P1", value: 22, color: "bg-red-600" },
  { label: "Urgent", value: 9, color: "bg-red-600" },
];

interface LeftColumnProps {
  summary?: DashboardSummary;
}

export function LeftColumn({ summary }: LeftColumnProps) {
  if (!summary) {
    return (
      <div className="flex flex-col gap-4">
        <div className="animate-pulse bg-slate-800 h-48 rounded-xl border border-slate-700" />
        <div className="animate-pulse bg-slate-800 h-64 rounded-xl border border-slate-700" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4 mb-4 lg:mb-0">
      <Card className="bg-red-900/20 border-red-900/50 text-center">
        <CardHeader className="pb-2 py-4">
          <CardTitle className="text-2xl font-bold text-red-500">
            {summary.totalTickets.toLocaleString()}
          </CardTitle>
          <p className="text-sm font-medium text-slate-300">Total Tickets</p>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 pt-4 border-t border-red-900/50">
          <div>
            <div className="text-lg font-bold text-red-500">
              {summary.totalOpen.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">Open</p>
          </div>
          <div>
            <div className="text-lg font-bold text-green-500">
              {summary.totalClosed.toLocaleString()}
            </div>
            <p className="text-xs text-slate-400">Closed</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="pb-2 bg-red-900/50">
          <CardTitle className="text-xs font-medium text-white text-center pt-4">
            Priority (Unresolved)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 justify-items-center gap-1 p-2 -mt-4">
          {priorityData.map((item, index) => (
            <Badge
              key={index}
              variant="secondary"
              className={`${item.color} text-white hover:${item.color}/90 flex flex-col items-center py-1 rounded-md h-12 w-16`}
            >
              <span className="text-xs font-normal">{item.label}</span>
              <span className="text-md font-bold">{item.value}</span>
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
