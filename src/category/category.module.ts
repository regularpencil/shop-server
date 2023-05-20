import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Filter, FilterSchema } from 'src/schemas/filter.schema';
import { CategoryService } from './category.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Filter.name, schema: FilterSchema}
        ])
    ],
    providers: [CategoryService],
    exports: [CategoryService],
})
export class CategoryModule {}
