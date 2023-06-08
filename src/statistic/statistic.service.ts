import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Statistic, StatisticDocument } from "../schemas/statisticSchema.schema";

@Injectable()
export class StatisticService {
    constructor(
        @InjectModel(Statistic.name) private statisticModel: Model<StatisticDocument>,
    ) {}

     private getDaysPerMonth = (year: number, month:number) => {
        return new Date(year, month, 0).getDate();
    };

    private rand(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    async pushStatistic(dto) {
        const date = new Date();
        const year = await this.statisticModel.findOne({year: date.getFullYear()});
        if(year) {
            const updatedMonths = [...year.months];
            updatedMonths[date.getMonth()].sum += dto.orderCost;
            updatedMonths[date.getMonth()].ordersNumber += 1;
            updatedMonths[date.getMonth()].days[date.getDate() - 1].sum += dto.orderCost;
            updatedMonths[date.getMonth()].days[date.getDate() - 1].ordersNumber += 1;
            await this.statisticModel.updateOne(
                {_id: year._id},
                {
                    $set: {
                        sum: year.sum + dto.orderCost,
                        months: updatedMonths, 
                    },
                    $inc: {
                        ordersNumber: 1,
                    }
                }
            );
        } else {
            const months = [];
            let days = [];
            const monthNames = [
                'Январь',
                'Февраль',
                'Март',
                'Апрель',
                'Май',
                'Июнь',
                'Июль',
                'Август',
                'Сентябрь',
                'Октябрь',
                'Ноябрь',
                'Декабрь'
            ]

            for(let i = 0; i < 12; i++) {
                let daysPerMonth = this.getDaysPerMonth(date.getFullYear(), i);
                for(let j = 0; j < daysPerMonth; j++) {
                    days.push({dayNumber: j + 1, sum: 0, ordersNumber: 0});
                }
                months.push({name: monthNames[i], monthNumber: i+1, sum: 0, days});
                days = [];
            }
            months[date.getMonth()].days[date.getDate() - 1].sum += dto.orderCost;
            months[date.getMonth()].days[date.getDate() - 1].ordersNumber += 1;
           

            await this.statisticModel.create({year: date.getFullYear(), months, sum: dto.orderCost, ordersNumber: 0});
        }
    }

    async getYearProfit(yearValue: number, dto) {
        const year = await this.statisticModel.findOne({year: yearValue});
        const date = new Date();

        if(year) {
            const months = []
        
            for(let i = 0; i < 12; i++) {
                let pointValue = 0;
                for(let j = 0; j < year.months[i].days.length; j++) {
                    if(dto.selectValue === 'Прибыль') {
                        pointValue += year.months[i].days[j].sum;
                    } else {
                        pointValue += year.months[i].days[j].ordersNumber;
                    }
                }
                if(pointValue > 0){
                    months.push({name: year.months[i].name, pointValue});
                }
            }
        
            return months;
        }
    }
    
    async getMonthProfit(dto) {
        const year = await this.statisticModel.findOne({year: dto.year});

        if(year) {
            const month = year.months[dto.month];
            const data = [];
            if(dto.selectValue === 'Прибыль') {
                month.days.forEach((day:any, index) => data.push({name: `${index + 1}.${dto.month+1}.${year.year}`, pointValue: day.sum}));
            } else {
                month.days.forEach((day:any, index) => data.push({name: `${index + 1}.${dto.month+1}.${year.year}`, pointValue: day.ordersNumber}));
            }
            return data;
        }
    }

    async getAllProfit(dto) {
        const years = await this.statisticModel.find().sort({year: 1});
        let data;
        if(dto.selectValue === 'Прибыль') {
            data = years.map(year => {return {name: year.year, pointValue: year.sum}});
        } else {
            data = years.map(year => {return {name: year.year, pointValue: year.ordersNumber}});
        }
        return data;
    }

    async getYears() {
        const years = await this.statisticModel.find().sort({year: 1});
        const data = years.map(year => year.year);
        return data;
    }

    async getMonths(yearValue: number) {
        const year = await this.statisticModel.findOne({year: yearValue});
        const date = new Date();
        const data = [];

        if(year.year < date.getFullYear()){
            for(let i = 0; i < 12; i++) {
                if(year.months[i].sum !== 0){
                    data.push(i);
                }
            }
        } else {
            for(let i = 0; i < date.getMonth() + 1; i++) {
                if(year.months[i].sum !== 0){
                    data.push(i);
                }
            }
        }
        return data;
    }
}