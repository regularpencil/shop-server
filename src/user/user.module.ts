import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';
import { MailModule } from '../mail/mail.module';
import { Order, OrderSchema } from '../schemas/order.schema';
import { Chat, ChatSchema } from '../schemas/chat.schema';
import { Product, ProductSchema } from '../schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Order.name, schema: OrderSchema},
            { name: Product.name, schema: ProductSchema},
            { name: Chat.name, schema: ChatSchema},
        ]),
        MailModule,
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule { }
