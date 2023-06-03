import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';
import { BadgeService } from './badges.service';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/badges')
export class BadgeController {
    constructor(private badgeService: BadgeService) { }

    @Get()
    async getBadges(@Res({ passthrough: true }) response: Response) {
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

    @Get('/test')
    async test(@Req() req) {
        console.log(req.cookies);
    }
}
