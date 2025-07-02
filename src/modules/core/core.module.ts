import { Module } from '@nestjs/common';
import { JwtGlobalModule } from './jwt.module';
import { TranslationModule } from './translation.module';
import { I18nTranslationService } from 'src/shared/services/translation.service';

@Module({
  imports: [JwtGlobalModule, TranslationModule],
  providers: [I18nTranslationService],
  exports: [I18nTranslationService],
})
export class CoreModule {}
