import { Injectable } from '@nestjs/common';
import {
  I18nContext,
  I18nService as NestiI18nService,
  TranslateOptions,
} from 'nestjs-i18n';

@Injectable()
export class I18nTranslationService {
  constructor(private readonly i18n: NestiI18nService) {}

  // Wrapper method to translate with automatic language context
  t(key: string, options?: TranslateOptions): string {
    const lang = I18nContext.current().lang;
    return this.i18n.t(key, { lang, ...options });
  }
}
