import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { MonthSchema } from "./common/month.schema";

export type StatisticDocument = Statistic & Document;

@Schema()
export class Statistic {
    @Prop()
    year: number

    @Prop()
    ordersNumber: number

    @Prop()
    sum: number

    @Prop({type: Array<typeof MonthSchema>})
    months;
}
export const StatisticSchema = SchemaFactory.createForClass(Statistic);
