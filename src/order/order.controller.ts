import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { OrderService } from "./order.service";
import { AddOrderDto } from "./dto/add-order.dto";
import { StatisticService } from "../statistic/statistic.service";
import { AuthGuard } from "@nestjs/passport";

@Controller('api/orders')
export class OrderController {

    constructor(
        private orderService: OrderService,
        private statisticService: StatisticService
    ) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async addOrder(@Body() addOrderDto: AddOrderDto) {
        const userOrders = await this.orderService.addOrder(addOrderDto);
        if(userOrders) {
            await this.statisticService.pushStatistic(addOrderDto);
            return userOrders;
        }
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:orderId')
    removeOrder(@Param('orderId') orderId) {
        return this.orderService.removeOrder(orderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/cancel')
    cancelOrder(@Body() cancelOrderDto) {
        console.log(cancelOrderDto);
        return this.orderService.cancelOrder(cancelOrderDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/status')
    changeOrderStatus(@Body() dto) {
        return this.orderService.changeOrderStatus(dto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('')
    async getOrders() {
        return this.orderService.getOrders();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:orderId')
    async getOrderById(@Param('orderId') orderId: string) {
        return this.orderService.getOrderById(orderId);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('status/:status')
    async getOrdersByStatus(@Param('status') status: string) {
        return this.orderService.getOrdersByStatus(status);
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get('/user/:userEmail')
    async getUserOrders(@Param('userEmail') userEmail: string) {
        return this.orderService.getUserOrders(userEmail);
    }
}
