import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "PLN") {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.NumberFormat("pl-PL").format(
    typeof date === "string" ? new Date(date).getTime() : date.getTime()
  );
}

export function truncateText(text: string, length: number) {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

export function generateRandomId() {
  return Math.random().toString(36).substring(2, 9);
}
