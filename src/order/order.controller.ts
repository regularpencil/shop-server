import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AddOrderDto } from "./dto/add-order.dto";
import { StatisticService } from "src/statistic/statistic.service";

@Controller('api/orders')
export class OrderController {

    constructor(
        private orderService: OrderService,
        private statisticService: StatisticService
    ) {}

    @Post()
    async addOrder(@Body() addOrderDto: AddOrderDto) {
        const userOrders = await this.orderService.addOrder(addOrderDto);
        if(userOrders) {
            await this.statisticService.pushStatistic(addOrderDto);
            return userOrders;
        }
    }

    @Delete('/:orderId')
    removeOrder(@Param('orderId') orderId) {
        return this.orderService.removeOrder(orderId);
    }

    @Put('/cancel')
    cancelOrder(@Body() cancelOrderDto) {
        console.log(cancelOrderDto);
        return this.orderService.cancelOrder(cancelOrderDto);
    }

    @Put('/status')
    changeOrderStatus(@Body() dto) {
        return this.orderService.changeOrderStatus(dto);
    }

    @Get('')
    async getOrders() {
        return this.orderService.getOrders();
    }

    @Get('status/:status')
    async getOrdersByStatus(@Param('status') status: string) {
        return this.orderService.getOrdersByStatus(status);
    }
    
    @Get('/:userEmail')
    async getUserOrders(@Param('userEmail') userEmail: string) {
        return this.orderService.getUserOrders(userEmail);
    }
}
