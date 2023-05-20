import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "src/schemas/order.schema";
import { User, UserDocument } from "src/schemas/user.schema";
import { AddOrderDto } from "./dto/add-order.dto";
import { Product, ProductDocument } from "src/schemas/productSchema";

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Product.name) private badgeModel: Model<ProductDocument>,
    ) {}

    async addOrder(dto: AddOrderDto) {
       
        await this.orderModel.create(dto);
        const {grades} = await this.userModel.findOne({email: dto.userEmail}, {_id: false, grades: true});

        for(let i = 0; i < dto.goods.length; i++) {
            let founded = false;
            for(let j = 0; j < grades.length; j++) {
                if(grades[j].productId === dto.goods[i]._id) {
                    grades[j].grade = 6;
                    founded = true;
                    break;
                }
            }

            await this.badgeModel.findOneAndUpdate({_id: dto.goods[i]._id}, {$inc:{purchases: dto.goods[i].count}});

            if(!founded) {
                grades.push({productId: dto.goods[i]._id, grade: 6});
            }
        }

        await this.userModel.findOneAndUpdate({email: dto.userEmail}, {$set:{grades}})
        
        const userOrders = await this.orderModel.find({
          $and: [
            {userEmail: dto.userEmail},
            {status:{$ne: "Отменён"}}
          ]
        });
        return userOrders;
    }

    async removeOrder(orderId: string) {
        await this.orderModel.findOneAndDelete({_id: orderId});
        return orderId;
    }

    async cancelOrder(dto) {
        await this.userModel.findOneAndUpdate({email: dto.email}, {$pull: {orders: dto.orderId}});
        await this.orderModel.findOneAndUpdate({_id: dto.orderId}, {$set:{status: 'Отменён'}});
        return dto.orderId;
    }

    async changeOrderStatus(dto) {
        await this.orderModel.findOneAndUpdate({_id: dto.orderId}, {$set:{status: dto.orderStatus}});
        return this.orderModel.findOne({_id: dto.orderId})
    }

    async getOrders() {
        return await this.orderModel.find();
    }

    async getOrdersByStatus(status: string) {
        return await this.orderModel.find({status});
    }

    async getNewOrders() {
        return await this.orderModel.find({status: 'Оформлен'});
    }

    async getUserOrders(userEmail: string) {
        const orders = await this.orderModel.find({
            $and: [
                {userEmail},
                {status:{$ne: "Отменён"}}
            ]
        });
        return orders;
    }
}