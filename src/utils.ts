import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const notify = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
  const event = new CustomEvent('app-notify', { detail: { message, type } });
  window.dispatchEvent(event);
};
