import { Module } from '@nestjs/common';
import { RecommendationController } from './recommendation.controller';
import { RecommendationService } from './recommendation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/user.schema';
import { Badge, BadgeSchema } from 'src/schemas/badge.shema';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Badge.name, schema: BadgeSchema}
        ])
    ],
    controllers: [RecommendationController],
    providers: [RecommendationService],
})
export class RecommendationModule {}
