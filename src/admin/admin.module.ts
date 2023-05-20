import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Filter, FilterSchema } from '../schemas/filter.schema';
import { Order, OrderSchema } from '../schemas/order.schema';
import { Statistic, StatisticSchema } from '../schemas/statisticSchema.schema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CategoryModule } from '../category/category.module';
import { City, CitySchema } from '../schemas/city.schema';
import { Product, ProductSchema } from '../schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Statistic.name, schema: StatisticSchema },
            { name: Order.name, schema: OrderSchema},
            { name: Filter.name, schema: FilterSchema},
            { name: City.name, schema: CitySchema}
        ]),
        CategoryModule,
    ],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule { }
