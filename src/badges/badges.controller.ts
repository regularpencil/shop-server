import { Body, Controller, Get, Put } from '@nestjs/common';
import { BadgeService } from './badges.service';

@Controller('api/badges')
export class BadgeController {
    constructor(private badgeService: BadgeService) { }
    @Get()
    async getBadges() {
        return this.badgeService.getBadges();
    }

    @Get('/popular')
    async getPopularBadges() {
        return this.badgeService.getPopularBadges();
    }

    @Get('/viewed')
    async getMostViewedBadges() {
        return this.badgeService.getMostViewedBadges();
    }

    @Put('/filter')
    async filterProducts(@Body() dto) {
        return this.badgeService.filterProducts(dto);
    }
}
