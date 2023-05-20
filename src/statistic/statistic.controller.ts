import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { StatisticService } from "./statistic.service";

@Controller('/api/statistic')
export class StatisticController {
    constructor(
        private statisticService: StatisticService
    ) {}

    @Post()
    async stat(@Body() dto) {
        this.statisticService.pushStatistic(dto);
    }

    @Get('/years')
    async getYears() {
        return this.statisticService.getYears();
    }

    @Get('/months/:year')
    async getMonths(@Param('year') year: number) {
        return this.statisticService.getMonths(Number(year));
    }

    @Post('/years/:year')
    async getYearProfit(@Param('year') year, @Body() getYearDto) {
        return this.statisticService.getYearProfit(Number(year), getYearDto);
    }

    @Put('/month')
    async getMonthProfit(@Body() dto) {
        return this.statisticService.getMonthProfit(dto);
    }

    @Post('/all')
    async getAllProfit(@Body() dto) {
        return this.statisticService.getAllProfit(dto);
    }
}