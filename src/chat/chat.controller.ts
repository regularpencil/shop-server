import { Controller, Get, Post, Param, Body, Put } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller('api/chats')
export class ChatController {
    constructor(
        private chatService: ChatService
    ) {}

    @Get('/:userEmail')
    getChats(@Param('userEmail') userEmail: string) {
        return this.chatService.getChats(userEmail);
    }

    @Post()
    sendMessage(@Body() sendMessageDto) {
        console.log(sendMessageDto);
        return this.chatService.sendMessage(sendMessageDto);
    }

    @Post('/order')
    sendOrderMessage(@Body() sendMessageDto) {
        console.log(sendMessageDto);
        return this.chatService.sendOrderMessage(sendMessageDto);
    }

    @Put()
    checkMessages(@Body() checkMessagesDto) {
        console.log( checkMessagesDto);
        return this.chatService.checkMessages( checkMessagesDto);
    }

}
