import { Buffer } from 'buffer';

/**
 * Encode to base64 from string
 * @param {string} input Plain string
 * @returns {string} Base64 String
 */
export function Base64Encode(input: string): string {
  const buffer = Buffer.from(input);
  return buffer
    .toString('base64')
    .replace(/\+/g, '-') // Replace + with -
    .replace(/\//g, '_') // Replace / with _
    .replace(/=+$/, ''); // Remove padding
}

/**
 * Decode from Base64 hash
 * @param {string} hash - Base64 String
 * @returns {string} Plain Text
 */
export function Base64Decode(hash: string): string {
  const padding = '='.repeat((4 - (hash.length % 4)) % 4); // Add padding
  const base64 =
    hash
      .replace(/-/g, '+') // Replace - with +
      .replace(/_/g, '/') + // Replace _ with /
    padding; // Add padding back
  const buffer = Buffer.from(base64, 'base64');
  return buffer.toString('utf-8');
}
