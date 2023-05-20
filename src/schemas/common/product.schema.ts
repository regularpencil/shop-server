import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Product {
    @Prop()
    name: string

    @Prop()
    price: number

    @Prop()
    count: number

    @Prop()
    imagePath: string
}

const schema = SchemaFactory.createForClass(Product);

export const ProductSchema = schema;