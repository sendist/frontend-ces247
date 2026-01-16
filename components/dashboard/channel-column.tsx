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
}

// Columns definition for the DataTable
const columns = [
  { key: "name", label: "Nama Perusahaan" },
  { key: "total", label: "Interaksi" },
  { key: "ticket", label: "Tiket" },
  { key: "pctFcr", label: "%FCR" },
  // API didn't return FCR per corporate, so we remove that column for now
];

const corporateColumns = [
  { key: "name", label: "Nama Perusahaan" },
  { key: "tickets", label: "Tiket" },
  { key: "fcr", label: "%FCR" },
];

const kipColumns = [
  { key: "category", label: "Detail Kategori" },
  { key: "tickets", label: "Tiket" },
  { key: "fcr", label: "%FCR" },
];

export function ChannelColumn({
  icon,
  title,
  sla,
  open,
  closed,
  topCorporateData,
  topKipData,
}: ChannelColumnProps) {
  return (
    <div className="flex flex-col">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center space-y-0 pb-0 -mt-2">
          {icon}
          <CardTitle className="text-md font-bold text-white ml-2 leading-none">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-between text-center px-4 pt-0 -mt-2 -mb-2">
          <div>
            <p className="text-xs text-slate-400 mb-1">SLA</p>
            <div className="bg-green-900/50 text-green-500 font-bold rounded-full w-16 h-8 flex items-center justify-center text-sm border-2 border-green-500">
              {sla}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Open</p>
            <div className="bg-red-900/50 text-red-500 font-bold rounded-full w-16 h-8 flex items-center justify-center text-sm border-2 border-red-500">
              {open}
            </div>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Closed</p>
            <div className="bg-blue-900/50 text-blue-500 font-bold rounded-full w-16 h-8 flex items-center justify-center text-sm border-2 border-blue-500">
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
