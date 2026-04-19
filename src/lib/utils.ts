import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatClock(date = new Date()) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}
