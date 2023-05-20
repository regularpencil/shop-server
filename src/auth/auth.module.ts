import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from 'src/mail/mail.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: 'SECRET_KEY',
            signOptions: {
                expiresIn: '24h'
            }
        }),
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: Chat.name, schema: ChatSchema}
        ]),
        MailModule,
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
