import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Month {
    @Prop()
    name: string

    @Prop()
    sum: number

    @Prop()
    days: {
        ordersNumber: number,
        sum: number
    }
}

const schema = SchemaFactory.createForClass(Month);

export const MonthSchema = schema;