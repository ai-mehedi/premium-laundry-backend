import { Global, Injectable } from '@nestjs/common';
import { Response, Request } from 'express';

@Global()
@Injectable()
export class CookieService {
  setCookie(
    res: Response,
    name: string,
    value: string,
    maxAge: string,
    options: Record<string, any> = {},
  ) {
    let expires_time = 0;
    if (maxAge === '5min') {
      expires_time = 300000;
    }

    if (maxAge === '1day') {
      expires_time = 86400000;
    }

    if (maxAge === '7day') {
      expires_time = 604800000;
    }

    if (maxAge === '1month') {
      expires_time = 2629746000;
    }

    res.cookie(name, value, {
      maxAge: expires_time,
      ...options,
    });
  }
  getSignedCookie(req: Request, name: string): string | undefined {
    return req.signedCookies[name];
  }
  getCookie(req: Request, name: string): string | undefined {
    return req.cookies[name];
  }
  clearCookie(res: Response, name: string, options: Record<string, any> = {}) {
    res.clearCookie(name, options);
  }
}
