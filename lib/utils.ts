import { clsx, type ClassValue } from "clsx"
import { format, parse } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDateStr(dateStr: string, formatStr: string = 'MM/dd/yyyy • eee') {
   
    const date = new Date(dateStr,);
    const formatted = format(date, formatStr);
    return formatted
}

export function formatDate(date: Date, formatStr: string = 'MM/dd/yyyy • eee') {
    const formatted = format(date, formatStr);
    return formatted
}