import { MongooseModule } from '@nestjs/mongoose';

import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ImageModule } from './image/image.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './products/products.module';
import { StatisticModule } from './statistic/statistic.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { ScheduleModule } from '@nestjs/schedule/dist';
import { ChatModule } from './chat/chat.module';
import { ReviewModule } from './review/review.module';
import { ConfigModule } from '@nestjs/config';
//mongodb://localhost:27017/shop-database
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb+srv://hollow:hollow@shop-cluster.ijyqlyu.mongodb.net/?retryWrites=true&w=majority'),
    UserModule,
    MailModule,
    AuthModule,
    AdminModule,
    ImageModule,
    ProductModule,
    OrderModule,
    StatisticModule,
    RecommendationModule,
    ScheduleModule.forRoot(),
    ChatModule,
    ReviewModule,
  ],
})
export class AppModule { }
