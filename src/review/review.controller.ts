import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('api/reviews')
export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    @Get('/:productId')
    getReviewsByProductId(@Param('productId') productId: string) {
        return this.reviewService.getReviewsByProductId(productId);
    }

    @Post()
    sendReview(@Body() sendReviewDto: CreateReviewDto) {
        return this.reviewService.sendReview(sendReviewDto);
    }
    
}
