/**
 * robust utility to handle Bangladesh Timezone (Asia/Dhaka) irrespective of user browser system time.
 */

export function getDhakaDate(dateInput: Date | string | number = new Date()): Date {
  // If we have a timestamp or string, construct Date
  const dateObj = typeof dateInput === 'object' ? dateInput : new Date(dateInput);
  
  // Format the date into Asia/Dhaka fields
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(dateObj);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') {
      map[part.type] = parseInt(part.value, 10);
    }
  }

  // Construct a new Date representing the wall-clock time in Bangladesh
  // Month in JS starting index is 0, so subtract 1
  return new Date(
    map.year,
    (map.month ?? 1) - 1,
    map.day,
    map.hour,
    map.minute,
    map.second
  );
}

/**
 * Returns a nicely formatted locale string in Bangladesh time (Asia/Dhaka)
 */
export function formatToDhakaTime(dateInput: Date | string | number = new Date()): string {
  const dateObj = typeof dateInput === 'object' ? dateInput : new Date(dateInput);
  return dateObj.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
}

/**
 * Returns a formatted date-only string in Bangladesh time (Asia/Dhaka)
 */
export function formatToDhakaDateOnly(dateInput: Date | string | number = new Date()): string {
  const dateObj = typeof dateInput === 'object' ? dateInput : new Date(dateInput);
  return dateObj.toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' });
}

/**
 * Returns Bangladesh current year (e.g. 2026)
 */
export function getDhakaFullYear(dateInput: Date | string | number = new Date()): number {
  return getDhakaDate(dateInput).getFullYear();
}
