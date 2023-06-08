import { Body, Controller, Get, Put, Req, Res } from '@nestjs/common';
import { ProductService } from './products.service';
import { Response } from 'express';

@Controller('api/badges')
export class ProductController {
    constructor(private productService: ProductService) { }

    @Get()
    async getBadges(@Res({ passthrough: true }) response: Response) {
        return this.productService.getBadges();
    }

    @Get('/popular')
    async getPopularBadges() {
        return this.productService.getPopularBadges();
    }

    @Get('/viewed')
    async getMostViewedBadges() {
        return this.productService.getMostViewedBadges();
    }

    @Put('/filter')
    async filterProducts(@Body() dto) {
        return this.productService.filterProducts(dto);
    }
}
