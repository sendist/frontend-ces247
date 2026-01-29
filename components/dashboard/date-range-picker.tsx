"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}

export function CalendarDateRangePicker({
  className,
  date,
  setDate,
}: CalendarDateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);

  const [months, setMonths] = useState(2); // default to desktop

  useEffect(() => {
    const updateMonths = () => {
      if (window.innerWidth < 768) {
        // mobile breakpoint
        setMonths(1);
      } else {
        setMonths(2);
      }
    };

    updateMonths(); // run on mount
    window.addEventListener("resize", updateMonths); // run on resize

    return () => window.removeEventListener("resize", updateMonths);
  }, []);

  // Sync tempDate with real date when popover OPENS only
  React.useEffect(() => {
    if (isOpen) {
      setTempDate(date);
    }
  }, [isOpen, date]);

  const handleApply = () => {
    // Force set the date to the parent
    console.log("Applying new date:", tempDate); // Debug log
    setDate(tempDate);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] sm:justify-start text-left font-normal bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white",
              !date && "text-muted-foreground",
              className,
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 bg-slate-800 border-slate-700"
          align="end"
        >
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={tempDate?.from}
            selected={tempDate}
            onSelect={setTempDate} // Automatically updates tempDate on click
            numberOfMonths={months}
            className="text-slate-200"
            // Ensure styles are visible
            classNames={{
              day_selected:
                "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
              day_today: "bg-slate-700 text-slate-50",
              day_outside: "text-slate-500 opacity-50",
            }}
          />
          <div className="flex items-center justify-end gap-2 p-3 border-t border-slate-700">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="text-slate-400 hover:text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleApply}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
