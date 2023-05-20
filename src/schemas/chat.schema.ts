import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ChatDocument = Chat & Document;

type MessageType = {
    message: string,
    date: string,
    role: string,
    isChecked: boolean
}

@Schema()
export class Chat {
    @Prop()
    userEmail: string

    @Prop()
    chatName: string

    @Prop({type: Array<MessageType>})
    messages

    @Prop()
    isChecked: boolean
}
export const ChatSchema = SchemaFactory.createForClass(Chat);
