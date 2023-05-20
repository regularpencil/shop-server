import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Badge, BadgeSchema } from 'src/schemas/badge.shema';
import { BadgeController } from './badges.controller';
import { BadgeService } from './badges.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Badge.name, schema: BadgeSchema }
    ])
  ],
  controllers: [BadgeController],
  providers: [BadgeService]
})
export class BadgeModule { }
