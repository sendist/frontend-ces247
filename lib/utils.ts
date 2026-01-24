import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfDay, addDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeDateRange(range?: { from?: Date; to?: Date }) {
  if (!range?.from) return null;

  const tz = "Asia/Jakarta"; // WIB

  const fromLocal = startOfDay(range.from);
  const toLocal = range.to
    ? addDays(startOfDay(range.to), 1)
    : addDays(fromLocal, 1);

  return {
    from: fromZonedTime(fromLocal, tz).toISOString(),
    to: fromZonedTime(toLocal, tz).toISOString(),
  };
}
