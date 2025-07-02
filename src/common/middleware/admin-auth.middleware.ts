import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { AppConfigService } from 'src/config/app.config';
import { Admin, AdminModel } from 'src/models/admin.schema';
import { CookieService } from 'src/shared/services/cookie.service';
import mongoose from 'mongoose';
import { removeTrailingSlash } from '../helpers/utils/string.utils';
import * as url from 'url';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: AdminModel,
    private readonly appConfigService: AppConfigService,
    private readonly cookieService: CookieService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const url_path = removeTrailingSlash(
      url.parse(req.originalUrl).pathname || '',
    );

    const cookieResult = this.cookieService.getSignedCookie(
      req,
      this.appConfigService.adminSession.key,
    );
    if (!cookieResult) {
      throw new UnauthorizedException({
        message: 'Unauthorized',
        continue: {
          redirect: '/admin/auth/login',
        },
      });
    }

    const getAdmin = await this.adminModel
      .findOne({
        _id: new mongoose.Types.ObjectId(cookieResult),
        isActive: true,
      })
      .select('-password -__v');
    if (!getAdmin) {
      this.cookieService.clearCookie(
        res,
        this.appConfigService.adminSession.key,
      );
      throw new UnauthorizedException({
        message: 'Unauthorized',
        continue: {
          redirect: '/admin/auth/login',
        },
      });
    }

    res.locals.auth_data = getAdmin.toObject();
    req['admin'] = getAdmin.toObject();
    res.locals['base_path'] = url_path.split('/');
    next();
  }
}
