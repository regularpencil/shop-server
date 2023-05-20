import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Chat, ChatDocument } from "../schemas/chat.schema";
@Injectable()
export class ChatService { 
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>
    ) {}

    private getOrderMessage(status, orderId) {
        switch(status) {
            case "Выполнен":
                return `Заказ ${orderId} выполнен`;
            case "Передан в доставку":
                return `Заказ ${orderId} передан в доставку`;
            case "Принят":
                return `Заказ ${orderId} принят`;
            default:
                return "Мда";
        }
    }

    async getChats(userEmail: string) {
        if(userEmail === 'admin') {
            return await this.chatModel.find({chatName:"Тех. поддержка"});
        } else {
            return await this.chatModel.find({userEmail})
        }
    }

    async getAdminChats() {
        const chats = await this.chatModel.find({chatName:"Тех. поддержка"});
        return chats;
    }

    async sendMessage(sendMessageDto) {
        const newMessage = {
            message: sendMessageDto.message,
            date: sendMessageDto.date,
            isUserMessage: sendMessageDto.isUserMessage,
            role: sendMessageDto.role
        }
        
        const {messages} = await this.chatModel.findOneAndUpdate({_id: sendMessageDto._id}, {$push: {messages: newMessage}});
     
        return [...messages, newMessage];
    }

    async sendOrderMessage(sendMessageDto) {
        const newMessage = {
            message: this.getOrderMessage(sendMessageDto.newStatus, sendMessageDto.orderId),
            date: sendMessageDto.date,
            role: 'admin',
        }
        
        await this.chatModel.findOneAndUpdate(
            {$and: [
                    {userEmail: sendMessageDto.userEmail},
                    {chatName: 'Заказы'}
                ]
            },
            {$push: {messages: newMessage}}
        );
     
        return newMessage
    }

    async checkMessages(checkMessagesDto) {
       
        const chat = await this.chatModel.findOne({_id: checkMessagesDto.chatId});
        const checkedMessages = chat.messages.map(message => {
            if(!message.isChecked && message.role !== checkMessagesDto.role) {
                return {...message, isChecked: true}
            } else {
                return message
            }
        });
        await this.chatModel.findOneAndUpdate({_id: checkMessagesDto.chatId}, {$set:{messages: checkedMessages}});

        return checkedMessages;
    }
}