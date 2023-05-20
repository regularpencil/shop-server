import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Product, ProductSchema } from 'src/schemas/product.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Product.name, schema: ProductSchema}
        ])
    ],
    controllers: [RecommendationController],
    providers: [RecommendationService],
})
export class RecommendationModule {}
