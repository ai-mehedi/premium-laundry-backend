import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';
@Schema({ timestamps: true })
export class Payment {
    @ApiProperty()
    @Prop({ type: String, required: true, default: 'Vendor Pay' })
    title: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    thumbnail: string; // Path or URL to invoice image

    @ApiProperty()
    @Prop({ type: Number, required: true, default: 0 })
    amount: number;

    @ApiProperty()
    @Prop({ type: String, required: true })
    paymentMethod: string; // e.g., "Bank Transfer", "Bkash"

    @ApiProperty()
    @Prop({ type: String, })
    transactionId?: string;

    @ApiProperty()
    @Prop({ type: Date, required: true })
    paymentDate: Date;

    @ApiProperty()
    @Prop({ type: Boolean, default: true })
    isActive: boolean;

    @ApiProperty()
    @Prop({ type: String })
    note?: string;


    @ApiProperty()
    @Prop({ type: String })
    invoice: string;

}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.plugin(paginatePlugin);
PaymentSchema.plugin(softDeletePlugin);

export type PaymentModel = PaginateModel<Payment> & SoftDeleteModel<Payment>;
