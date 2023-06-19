import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from '../schemas/order.schema';
import { OrderService } from './order.service';
import { User, UserSchema } from '../schemas/user.schema';
import { OrderController } from './order.controller';
import { StatisticModule } from '../statistic/statistic.module';
import { Product, ProductSchema } from '../schemas/product.schema';
import { MailModule } from 'src/mail/mail.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Order.name, schema: OrderSchema},
            {name: User.name, schema: UserSchema},
            {name: Product.name, schema: ProductSchema}
        ]),
        StatisticModule,
        MailModule,
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [],
})
export class OrderModule {}
