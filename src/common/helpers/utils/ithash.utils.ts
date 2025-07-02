import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// Encrypt function
export function itHashEncryptOne(data: string): string {
  const key = crypto.randomBytes(32); // Generate a new 256-bit key for each encryption
  const iv = crypto.randomBytes(16); // 16-byte IV

  const cipher = crypto.createCipheriv(algorithm, key, iv);

  const randomPrefix = Math.floor(100 + Math.random() * 900).toString(); // 3-digit random string
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit random string

  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Concatenate key, IV, prefix, encrypted data, and suffix, all in hex
  const result =
    key.toString('hex') +
    iv.toString('hex') +
    randomPrefix +
    encrypted +
    randomSuffix;
  return result;
}

export function itHashDecryptOne(encryptedData: string): string {
  const keyHex = encryptedData.slice(0, 64); // First 64 hex characters = 32 bytes key
  const ivHex = encryptedData.slice(64, 96); // Next 32 hex characters = 16 bytes IV
  const encrypted = encryptedData.slice(99, -4); // Main encrypted content

  const key = Buffer.from(keyHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');

  const decipher = crypto.createDecipheriv(algorithm, key, iv);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
