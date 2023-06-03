import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TokenDocument = Token & Document;

@Schema()
export class Token {
    @Prop()
    userEmail: string

    @Prop()
    refreshToken: string
}
export const TokenSchema = SchemaFactory.createForClass(Token);
