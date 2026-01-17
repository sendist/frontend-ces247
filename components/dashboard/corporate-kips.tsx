import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types ---
interface SubItem {
  label: string;
  percentage: number;
}

interface CorporateSlaItem {
  companyName: string;
  totalPercentage: number;
  items: SubItem[];
}

interface SlaCustomerKipProps {
  data?: CorporateSlaItem[];
  itemsPerPage?: number; // Added prop to control items per page
}

// --- Sample Data from Image ---
const DEFAULT_DATA: CorporateSlaItem[] = [
  {
    companyName: "PT. SUPER SPRING",
    totalPercentage: 91.64,
    items: [
      { label: "Kendala penggunaan kartu SIM", percentage: 100.0 },
      { label: "Informasi sisa kuota", percentage: 100.0 },
      { label: "Re-aktivasi", percentage: 58.57 },
    ],
  },
  {
    companyName: "SINAR GLOBAL SOLUSINDO",
    totalPercentage: 88.94,
    items: [
      { label: "Permintaan Refresh GPRS", percentage: 89.59 },
      { label: "Informasi sisa kuota", percentage: 100.0 },
      { label: "Berhenti Berlangganan atau Terminasi", percentage: 51.61 },
    ],
  },
  {
    companyName: "PT. SUMBER SINERGI MAKMUR",
    totalPercentage: 86.94,
    items: [
      { label: "Re-aktivasi", percentage: 79.1 },
      { label: "Informasi status nomor", percentage: 95.61 },
      { label: "Informasi sisa kuota", percentage: 95.41 },
    ],
  },
  {
    companyName: "PT. PERTAMINA (PERSERO )",
    totalPercentage: 91.21,
    items: [
      { label: "Permintaan aktivasi paket (Scheduling)", percentage: 94.61 },
      { label: "Permintaan aktivasi paket (On The Spot)", percentage: 92.05 },
      { label: "Permintaan aktivasi paket", percentage: 82.67 },
    ],
  },
  {
    companyName: "PT. PANCARAN TEKNOLOGI TRANSPORTASI",
    totalPercentage: 61.51,
    items: [
      { label: "Informasi sisa kuota", percentage: 57.49 },
      { label: "Permintaan aktivasi paket", percentage: 74.63 },
      { label: "Permintaan aktivasi paket (Scheduling)", percentage: 50.0 },
    ],
  },
];

export function SlaCustomerKipCard({ 
  data = DEFAULT_DATA, 
  itemsPerPage = 4 // Default to 2 so we can see pagination with the 5 sample items
}: SlaCustomerKipProps) {
  
  // 1. Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // 2. Calculate Indexes
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // 3. Slice Data for Display
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // 4. Navigation Handlers
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Helper to render the percentage bar
  const ProgressBar = ({ value, isMain }: { value: number; isMain: boolean }) => (
    <div className="flex w-[120px] sm:w-[150px] justify-start bg-gray-200 h-4 sm:h-5 rounded-sm overflow-hidden">
      <div
        className={cn(
          "flex items-center justify-end px-2 text-xs font-bold text-white transition-all duration-500",
          isMain ? "bg-[#0B1750]" : "bg-[#2b6cb0]"
        )}
        style={{ width: `${value}%` }}
      >
        {value.toLocaleString("id-ID", { minimumFractionDigits: 2 })}%
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-4xl border-none bg-[#F3F4F6] shadow-sm">
      {/* Header with Search */}
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6">
        <CardTitle className="text-md font-bold text-red-600">
          SLA Customer to KIP
        </CardTitle>
        <div className="flex flex-col gap-1 w-full sm:w-auto mt-2 sm:mt-0">
          <label className="text-xs font-bold text-slate-800 ml-1">
            Corp Search
          </label>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500" />
            <Input 
              className="h-7 w-full sm:w-[200px] bg-white border-gray-300 pl-7 text-xs" 
              placeholder="" 
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6">
        <div className="flex flex-col space-y-2 min-h-[200px]">
          {/* Loop through currentItems instead of all data */}
          {currentItems.map((corp, index) => (
            <div key={index} className="flex flex-col border-b border-gray-300 pb-2 last:border-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Main Corporate Row */}
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900 truncate pr-4">
                  {corp.companyName}
                </span>
                <ProgressBar value={corp.totalPercentage} isMain={true} />
              </div>

              {/* Sub Items */}
              <div className="flex flex-col gap-1">
                {corp.items.map((item, subIndex) => (
                  <div key={subIndex} className="flex items-center justify-between pl-4">
                    <span className="text-[8pt] text-slate-700 truncate pr-4 bg-gray-100/50">
                      {item.label}
                    </span>
                    <ProgressBar value={item.percentage} isMain={false} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-sm font-bold text-slate-900 mr-2">Page</span>
          
          {/* Dynamic Page Buttons */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button 
              key={page}
              size="sm" 
              onClick={() => handlePageClick(page)}
              className={cn(
                "h-7 w-7 rounded-none p-0 text-xs transition-colors",
                currentPage === page 
                  ? "bg-[#C20000] text-white hover:bg-[#a00000]" // Active State
                  : "bg-gray-300 text-slate-600 hover:bg-gray-400" // Inactive State
              )}
            >
              {page}
            </Button>
          ))}

          {/* Navigation Arrows */}
          <div className="flex gap-1 ml-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="h-7 w-7 rounded-full border-2 border-slate-800 p-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
            >
               <ChevronLeft className="h-4 w-4 text-slate-800" />
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="h-7 w-7 rounded-full border-2 border-slate-800 p-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100"
            >
               <ChevronRight className="h-4 w-4 text-slate-800" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}