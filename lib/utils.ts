import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility function for conditionally combining Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats numbers into Indian Rupee currency format (e.g. ₹1,50,000)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a Date object or ISO string into human-readable festival date (e.g. Sep 4, 2026)
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

/**
 * Formats a Date object or ISO string into time representation (e.g. 10:30 AM)
 */
export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

/**
 * Generates a random 6-character uppercase alphanumeric team invite code (e.g. "AST9X2")
 */
export function generateInviteCode(length = 6): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // excludes confusing 0/O, 1/I
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates an official ASTITVA participant ID with 4-digit sequence (e.g. "AST26-1042")
 */
export function generateParticipantId(seq: number): string {
  return `AST26-${String(seq).padStart(4, "0")}`;
}

/**
 * Truncates long text with an ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.slice(0, length)}...`;
}

/**
 * Converts a string into a URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
