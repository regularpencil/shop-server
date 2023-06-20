import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ProductDocument = Product & Document;

type ProductParametersType = {
    parameterName: string,
    parameterValue: string,
}

@Schema()
export class Product {
    @Prop()
    id: number

    @Prop()
    name: string

    @Prop()
    imagePath: string

    @Prop()
    price: number
    
    @Prop()
    views: number

    @Prop()
    purchases: number

    @Prop()
    stock: number

    @Prop()
    description: string

    @Prop({type: Array<ProductParametersType>})
    parameters;

    @Prop()
    category: string
}

export const ProductSchema = SchemaFactory.createForClass(Product);
