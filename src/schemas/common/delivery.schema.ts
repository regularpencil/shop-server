import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Delivery {
    @Prop()
    mailIndex: string

    @Prop()
    addressee: string

    @Prop()
    address: string
}

const schema = SchemaFactory.createForClass(Delivery);

export const DeliverySchema = schema;
