import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';

export enum NOTIFICATION_PREFERENCE_TYPE {
  NEW_LISTING = 'new_listing',
  NEW_MESSAGE = 'new_message',
  FAVORITE_LISTING = 'favorite_listing',
  FINISH_PROFILE = 'finish_profile',
  FINISH_LISTING = 'finish_listing',
  CHAT_REQUEST = 'chat_request',
}

export class UpdateNotificationPreferencesDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(NOTIFICATION_PREFERENCE_TYPE)
  type: NOTIFICATION_PREFERENCE_TYPE;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}
