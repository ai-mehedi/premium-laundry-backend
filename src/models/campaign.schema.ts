import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument } from 'mongoose';
import { PaginateModel } from 'src/shared/plugins/mongoose-plugin/pagination/types';
import { SoftDeleteModel } from 'src/shared/plugins/mongoose-plugin/soft-delete/types';
import { paginatePlugin } from 'src/shared/plugins/mongoose-plugin/pagination/plugin';
import { softDeletePlugin } from 'src/shared/plugins/mongoose-plugin/soft-delete/plugin';

export type CampaignDocument = HydratedDocument<Campaign>;
mongoose.Schema.Types.String.set('trim', true);

@Schema({
    timestamps: true,
})
export class Campaign {
    @ApiProperty()
    @Prop({ type: String, required: true })
    title: string;

    @ApiProperty()
    @Prop({ type: String, required: true })
    thumbnail: string;

    @ApiProperty()
    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

export const CampaignSchema = SchemaFactory.createForClass(Campaign);

CampaignSchema.plugin(paginatePlugin);
CampaignSchema.plugin(softDeletePlugin);

export type CampaignModel = PaginateModel<Campaign> & SoftDeleteModel<Campaign>;
