import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from '../schemas/review.schema';
import { SendReviewDto } from './dto/send-review.dto';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ReviewService {
    constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

    async getReviewsByProductId(productId: string) {
        const reviews = (await this.reviewModel.findOne({productId}));
        if(!reviews) {
            return []
        }
        return reviews.reviews;
    }

    async sendReview(sendReviewDto: SendReviewDto) {
        const reviews = await this.reviewModel.findOne({productId: sendReviewDto.productId});
        const date = new Date().toLocaleString('ru', {
            month: 'long',
            day: 'numeric'
        });

        const newReview = {
            userName: sendReviewDto.userName,
            message: sendReviewDto.message,
            date,
        }

        if(!reviews) {
            await this.reviewModel.create({
                productId: sendReviewDto.productId,
                reviews: [newReview]
            })
        } else {
            await reviews.updateOne({$push:{reviews: newReview}});
        }

        return newReview;
    }
}
