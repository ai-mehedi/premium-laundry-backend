import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type UserDocument = HydratedDocument<User>;
mongoose.Schema.Types.String.set('trim', true);

@Schema()
export class UserAvatar {
  @ApiProperty()
  @Prop({ type: String, required: true })
  originalName: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  fileName: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  fileSize: number;

  @ApiProperty()
  @Prop({ type: String, required: true })
  mimeType: string;

  @ApiProperty()
  @Prop({ type: String, required: true })
  filePath: string;
}

@Schema()
export class UserForgotPassword {
  @ApiProperty()
  @Prop({ type: String, required: true })
  code: string;

  @ApiProperty()
  @Prop({ type: Number, required: true })
  maxRetry: number;

  @ApiProperty()
  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

@Schema({
  timestamps: true,
})
export class User {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  email?: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  phone: string;

  @ApiProperty()
  @Prop({ type: String, required: false })
  fullAddress?: string;

  @ApiProperty()
  @Prop({ type: UserAvatar, required: false, })
  avatar?: UserAvatar;

  @ApiProperty()
  @Prop({ type: String, required: true, })
  password: string;

  @ApiProperty()
  @Prop({ type: UserForgotPassword, required: false })
  forgotPassword?: UserForgotPassword;

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(paginatePlugin);
UserSchema.plugin(softDeletePlugin);

export type UserModel = PaginateModel<User> & SoftDeleteModel<User>;
