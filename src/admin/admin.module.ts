import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, BadgeSchema } from 'src/schemas/badge.shema';
import { Filter, FilterSchema } from 'src/schemas/filter.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Statistic, StatisticSchema } from 'src/schemas/statisticSchema';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CategoryModule } from 'src/category/category.module';
import { City, CitySchema } from 'src/schemas/city.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Badge.name, schema: BadgeSchema },
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
