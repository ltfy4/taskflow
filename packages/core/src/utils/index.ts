/**
 * Formats a date string as a human-readable date (e.g., "Monday, February 21")
 */
export function formatDateLong(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

/**
 * Formats a date string as a short date (e.g., "Feb 21")
 */
export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Returns today's date as a YYYY-MM-DD string
 */
export function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Checks if a date string is before today
 */
export function isOverdue(dateStr: string): boolean {
  return dateStr < getTodayString();
}

/**
 * Checks if a date string is within the next N days from today
 */
export function isWithinDays(dateStr: string, days: number): boolean {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  const diffMs = target.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

/**
 * Generates a UUID v4 (for client-side use before sync)
 */
export function generateId(): string {
  return crypto.randomUUID();
}
