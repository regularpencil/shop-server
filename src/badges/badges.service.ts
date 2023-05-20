import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class BadgeService {
    constructor(@InjectModel(Product.name) private badgeModel: Model<ProductDocument>) { }

    async getBadges() {
        const badges = await this.badgeModel.find();
        return badges;
    }

    async getPopularBadges() {
        const popularBadges = await this.badgeModel.find().sort({purchases: -1}).limit(10);
        return popularBadges;
    }

    async getMostViewedBadges() {
        const mostViewedBadges = await this.badgeModel.find().sort({views: -1}).limit(10);
        return mostViewedBadges;
    }

    private filter(product, categories) {
        const category = categories.find(item => item.categoryName == product.category);      
    
        if(category) {
            const productParametrs = product.parameters.map(item => item.parameterValue);
            let counter = 0;
            
            for(let i = 0; i < category.filters.length; i++) {
                for(let j = 0; j < category.filters[i].filterValues.length; j++) {
                    if(productParametrs.includes(category.filters[i].filterValues[j])) {
                        counter++;
                        break;
                    }
                }
            }

            if(counter === category.filters.length) {
                return true;
            }
        }
        return false;
    }

    async filterProducts(categories) {
        const badges = await this.badgeModel.find();
        if(categories.length === 0){
            return badges;
        } else {
            const filteredProducts = badges.filter(item => this.filter(item, categories));
            return filteredProducts;
        }
    }
}
