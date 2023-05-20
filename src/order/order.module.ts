import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { OrderService } from './order.service';
import { User, UserSchema } from 'src/schemas/user.schema';
import { OrderController } from './order.controller';
import { StatisticModule } from 'src/statistic/statistic.module';
import { Product, ProductSchema } from 'src/schemas/productSchema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Order.name, schema: OrderSchema},
            {name: User.name, schema: UserSchema},
            {name: Product.name, schema: ProductSchema}
        ]),
        StatisticModule,
    ],
    controllers: [OrderController],
    providers: [OrderService],
    exports: [],
})
export class OrderModule {}
