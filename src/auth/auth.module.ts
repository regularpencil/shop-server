import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '../mail/mail.module';
import { User, UserSchema } from '../schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Chat, ChatSchema } from '../schemas/chat.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config/dist';
import { JwtStrategy } from './jwt.strategy';
import { Token, TokenSchema } from '../schemas/token.schema';
@Module({
    imports: [
        ConfigModule,
        JwtModule.register({}),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Chat.name, schema: ChatSchema},
            { name: Token.name, schema: TokenSchema},
        ]),
        MailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy]
})
export class AuthModule { }
