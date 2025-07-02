/**
 * Convert bytes to a human-readable format (B, KB, MB, GB, TB, PB, EB).
 * @param bytes - The size in bytes to be converted.
 * @param decimals - The number of decimal places to display (default is 2).
 * @returns The formatted size string.
 */
export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
  );
}
