import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type FilterDocument = Filter & Document;

type FilterType = {
    filterName: string,
    filterValues: Array<string>
}

@Schema()
export class Filter {
    @Prop()
    category: string

    @Prop({type: Array<FilterType>})
    filters
}
export const FilterSchema = SchemaFactory.createForClass(Filter);
