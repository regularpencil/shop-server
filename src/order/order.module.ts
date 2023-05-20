import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Mongoose } from 'mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { OrderService } from './order.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { OrderController } from './order.controller';
import { StatisticModule } from 'src/statistic/statistic.module';
import { Badge, BadgeSchema } from 'src/schemas/badge.shema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Order.name, schema: OrderSchema},
            {name: User.name, schema: UserSchema},
            {name: Badge.name, schema: BadgeSchema}
        ]),
        StatisticModule,
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [],
})
export class OrderModule {}
