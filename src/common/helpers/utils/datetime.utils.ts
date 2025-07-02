export function getDiffInSeconds(date: Date): number {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - date.getTime();
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
  return differenceInSeconds;
}

export function getTimeDifference(lastResend: Date): number {
  return getDiffInSeconds(lastResend);
}

/**
 * Convert milliseconds to a human-readable format (days, hours, minutes, seconds, milliseconds).
 * @param milliseconds - The duration in milliseconds to be converted.
 * @returns A string representing the duration in a human-readable format.
 */
export function formatDurationFromMilliseconds(milliseconds: number): string {
  const ms = milliseconds % 1000;
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
  if (ms > 0) parts.push(`${ms} millisecond${ms !== 1 ? 's' : ''}`);

  return parts.join(', ') || '0 milliseconds';
}

export function formatDateTime(date: Date | string | number): string {
  const d = new Date(date);

  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return d.toLocaleString('en-US', options).replace(',', '');
}

export function toDatetimeLocal(date) {
  const pad = (n) => n.toString().padStart(2, '0');

  return (
    date.getFullYear() +
    '-' +
    pad(date.getMonth() + 1) +
    '-' +
    pad(date.getDate()) +
    'T' +
    pad(date.getHours()) +
    ':' +
    pad(date.getMinutes())
  );
}

export function timeAgo(date: Date | string | number): string {
  const now = Date.now();
  const givenDate = typeof date === 'number' ? date : new Date(date).getTime();
  const seconds = Math.floor((now - givenDate) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} days ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} months ago`;

  const years = Math.floor(months / 12);
  return `${years} years ago`;
}
