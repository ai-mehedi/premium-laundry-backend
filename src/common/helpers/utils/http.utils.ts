import { Request } from 'express';

export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers['x-forwarded-for'] as string;
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }
  return '43.230.120.23';
}
