import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type ShoecareDocument = HydratedDocument<Shoecare>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({ timestamps: true, _id: true })
export class ShoeProduct {
    @ApiProperty({ type: String })
    @Prop({ type: String, required: true })
    name: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    service: string;

    @ApiProperty({ type: String })
    @Prop({ type: String, required: true })
    price: string;
}




@Schema({
    timestamps: true,
})
export class Shoecare {
    @ApiProperty()
    @Prop({ type: String, required: true })
    name: string;
    @ApiProperty()
    @Prop({ type: String, required: true })
    phone: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    address: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    pickupdate: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    pickuptime: string;


    @ApiProperty()
    @Prop({ type: String, required: true })
    description: string;

    @ApiProperty()
    @Prop({ type: String, default: 'pending' })
    status: string;

    @ApiProperty()
    @Prop({ type: [ShoeProduct] })
    services: ShoeProduct[];

    @ApiProperty()
    @Prop({ type: Number, })
    payableamount: number;

    @ApiProperty()
    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

export const ShoecareSchema = SchemaFactory.createForClass(Shoecare);

ShoecareSchema.plugin(paginatePlugin);
ShoecareSchema.plugin(softDeletePlugin);

export type ShoecareModel = PaginateModel<Shoecare> & SoftDeleteModel<Shoecare>;
