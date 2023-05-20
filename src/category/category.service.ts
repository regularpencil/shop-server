import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Filter, FilterDocument } from "src/schemas/filter.schema";

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Filter.name) private filterModel: Model<FilterDocument>,
    ) { }

    async createCategory(category: string) {
        console.log(category);
        return await this.filterModel.create({category, filters: []});
    }

    async addFilter(filterName: string, categoryName: string) {
        const newFilter = {filterName, filterValues: []};
        return await this.filterModel.findOneAndUpdate({category: categoryName}, {$push: { filters: newFilter } });
    }

    async addFilterValue(filterValue: string, filterName: string, categoryName: string) {
        return await this.filterModel.findOneAndUpdate(
            {category: categoryName},
            {$push: {"filters.$[elem].filterValues": filterValue}},
            {arrayFilters:[{"elem.filterName": filterName}]}
        );
    }

    async getFilters() {
        return await this.filterModel.find();
    }
}