import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DataTableProps {
  title: string;
  data: any[];
  columns: { key: string; label: string }[];
}

export function DataTable({ title, data, columns }: DataTableProps) {
  return (
    <Card className="bg-slate-800 border-slate-700 mt-4">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-900/50">
            <TableRow className="border-slate-700 hover:bg-slate-900/50">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className="text-slate-400 h-6 text-[10px]"
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, i) => (
              <TableRow
                key={i}
                className="border-slate-700 hover:bg-slate-800/50"
              >
                {columns.map((col) => (
                  <TableCell key={col.key} className="text-slate-300 py-1 text-[8px]">
                    {row[col.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}