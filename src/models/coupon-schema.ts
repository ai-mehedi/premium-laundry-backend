import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type CouponDocument = HydratedDocument<Coupon>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
    timestamps: true,
})
export class Coupon {
    @ApiProperty()
    @Prop({ type: String, required: true })
    title: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    discountCode: string;

    @ApiProperty()
    @Prop({ type: Number, required: true })
    percentage: number;

    @ApiProperty()
    @Prop({ type: Number, required: true })
    maximumAttendeeCapacity: number;

    @ApiProperty()
    @Prop({ type: Number, })
    totalamount: number;

    @ApiProperty()
    @Prop({ type: Date, required: true })
    expierationDate: Date;

    @ApiProperty()
    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.plugin(paginatePlugin);
CouponSchema.plugin(softDeletePlugin);

export type CouponModel = PaginateModel<Coupon> & SoftDeleteModel<Coupon>;
