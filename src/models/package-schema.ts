import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type PackageDocument = HydratedDocument<Package>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
    timestamps: true,
})
export class Package {
    @ApiProperty()
    @Prop({ type: String, required: true })
    title: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    description: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    thumbnail: string;

    @ApiProperty()
    @Prop({ type: Number, required: true })
    price: number;

    @ApiProperty()
    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

export const PackageSchema = SchemaFactory.createForClass(Package);

PackageSchema.plugin(paginatePlugin);
PackageSchema.plugin(softDeletePlugin);

export type PackageModel = PaginateModel<Package> & SoftDeleteModel<Package>;
