import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schemas/product.schema';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

    async getBadges() {
        const badges = await this.productModel.find();
        return badges;
    }

    async getProductById(productId) {
        const product =await this.productModel.findOne({_id: productId});
        return product;
    }

    async getPopularBadges() {
        const popularBadges = await this.productModel.find().sort({purchases: -1}).limit(10);
        return popularBadges;
    }

    async getMostViewedBadges() {
        const mostViewedBadges = await this.productModel.find().sort({views: -1}).limit(10);
        return mostViewedBadges;
    }

    private checkProduct(product, categories) {
        const category = categories.find(item => item.categoryName == product.category);      
    
        if(category) {
            const productParameters = product.parameters.map(item => item.parameterValue);
            let counter = 0;
            
            for(let i = 0; i < category.filters.length; i++) {
                for(let j = 0; j < category.filters[i].filterValues.length; j++) {
                    if(productParameters.includes(category.filters[i].filterValues[j])) {
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
        const products = await this.productModel.find();
        if(categories.length === 0){
            return products;
        } else {
            const filteredProducts = products.filter(product => this.checkProduct(product, categories));
            return filteredProducts;
        }
    }
}
