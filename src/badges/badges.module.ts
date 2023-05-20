import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BadgeController } from './badges.controller';
import { BadgeService } from './badges.service';
import { Product, ProductSchema } from 'src/schemas/productSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema }
    ])
  ],
  controllers: [BadgeController],
  providers: [BadgeService]
})
export class BadgeModule { }
