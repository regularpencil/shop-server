import { Prop, Schema, SchemaFactory, raw } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { DeliverySchema } from "./common/delivery.schema";
import { ProductSchema } from "./common/Product.schema";

export type OrderDocument = Order & Document;

type PickAddressType = {
    city: string,
    street: string,
}

@Schema()
export class Order {
    @Prop()
    orderCost: number

    @Prop({type: Array<typeof ProductSchema>})
    goods;

    @Prop()
    status: string

    @Prop()
    paymentType: string

    @Prop()
    userEmail: string

    @Prop()
    isDelivery: boolean

    @Prop(raw({
        city: { type: String },
        street: { type: String }
      }))
    pickAddress

    @Prop({type: typeof DeliverySchema, required: false})
    deliveryData;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
