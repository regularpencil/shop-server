import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

interface IGrade {
    productId: string,
    grade: number,
}

@Schema()
export class User {
    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    password: string

    @Prop()
    role: string

    @Prop()
    phoneNumber: string

    @Prop()
    isActivated: boolean

    @Prop()
    activationLink: string

    @Prop()
    favorites: number[]

    @Prop()
    history: Array<any>

    @Prop({type: Array<IGrade>})
    grades
}

export const UserSchema = SchemaFactory.createForClass(User);
