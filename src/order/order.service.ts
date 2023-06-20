import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Order, OrderDocument } from "../schemas/order.schema";
import { User, UserDocument } from "../schemas/user.schema";
import { AddOrderDto } from "./dto/add-order.dto";
import { Product, ProductDocument } from "../schemas/product.schema";

@Injectable()
export class OrderService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    ) {}

    async addOrder(addOrderDto: AddOrderDto): Promise<any> {
        const addedOrder = await this.orderModel.create(addOrderDto);
        const user = await this.userModel.findOne({email:addOrderDto.userEmail});

        if(user) {
            const {grades} = await this.userModel.findOne({email: addOrderDto.userEmail}, {_id: false, grades: true});
    
            for(let i = 0; i < addOrderDto.goods.length; i++) {
                let founded = false;
                for(let j = 0; j < grades.length; j++) {
                    if(grades[j].productId === addOrderDto.goods[i]._id) {
                        grades[j].grade = 6;
                        founded = true;
                        break;
                    }
                }
    
                await this.productModel.findOneAndUpdate(
                    {_id: addOrderDto.goods[i]._id},
                    {$inc:{
                        purchases: addOrderDto.goods[i].count,
                        stock: -addOrderDto.goods[i].count
                    }}
                );
    
                if(!founded) {
                    grades.push({productId: addOrderDto.goods[i]._id, grade: 6});
                }
            }
    
            await this.userModel.findOneAndUpdate({email: addOrderDto.userEmail}, {$set:{grades}})
            
            const userOrders = await this.orderModel.find({
              $and: [
                {userEmail: addOrderDto.userEmail},
                {status:{$ne: "Отменён"}}
              ]
            });

            return {userRegistered: true, userOrders};
        } else {
            return {userRegistered: false, orderId: addedOrder._id};
        }
    }

    async removeOrder(orderId: string) {
        await this.orderModel.findOneAndDelete({_id: orderId});
        return orderId;
    }

    async cancelOrder(cancelOrderDto) {
        await this.userModel.findOneAndUpdate(
            {email: cancelOrderDto.email},
            {$pull: {orders: cancelOrderDto.orderId}}
        );
        await this.orderModel.findOneAndUpdate(
            {_id: cancelOrderDto.orderId},
            {$set:{status: 'Отменён'}}
        );
        return cancelOrderDto.orderId;
    }

    async changeOrderStatus(dto) {
        await this.orderModel.findOneAndUpdate({_id: dto.orderId}, {$set:{status: dto.orderStatus}});
        return this.orderModel.findOne({_id: dto.orderId})
    }

    async getOrders() {
        return await this.orderModel.find();
    }

    async getOrderById(orderId: string) {
        return await this.orderModel.findOne({_id: orderId});
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