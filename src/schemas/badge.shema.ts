import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BadgeDocument = Badge & Document;

type ProductParametersType = {
    parameterName: string,
    parameterValue: string,
}

@Schema()
export class Badge {
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
    description: string

    @Prop({type: Array<ProductParametersType>})
    parameters;

    @Prop()
    category: string
}

export const BadgeSchema = SchemaFactory.createForClass(Badge);
