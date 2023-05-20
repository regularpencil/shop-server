import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ReviewDocument = Review & Document;

type ReviewType = {
    userName: string,
    message: string,
    date: string,
}

@Schema()
export class Review {
   @Prop()
   productId: string
   
   @Prop({type: Array<ReviewType>})
   reviews
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
