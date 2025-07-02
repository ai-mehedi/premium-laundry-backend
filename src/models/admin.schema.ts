import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
import { ADMIN_ROLE } from 'src/common/types/admin-auth.types';

export type AdminDocument = HydratedDocument<Admin>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
  timestamps: true,
})
export class Admin {
  @ApiProperty()
  @Prop({ type: String, required: true })
  name: string;

  @ApiProperty()
  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty()
  @Prop({
    required: true,
    type: [
      {
        type: String,
        enum: Object.values(ADMIN_ROLE),
      },
    ],
  })
  roles: ADMIN_ROLE[];

  @ApiProperty()
  @Prop({ type: Boolean, required: true })
  isActive: boolean;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.plugin(paginatePlugin);
AdminSchema.plugin(softDeletePlugin);

export type AdminModel = PaginateModel<Admin> & SoftDeleteModel<Admin>;
