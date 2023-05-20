import { Body, Controller, Delete, Get, Param, Post, Put, Query, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { AdminService } from "./admin.service";
import { CategoryService } from "src/category/category.service";

interface QueryDto {
    name: string,
    price: number,
    fastening: string,
    description: string,
    material: string
}

@Controller('api/admin')
export class AdminController {
    constructor(
        private adminService: AdminService,
        private categoryService: CategoryService,
    ) {}

    @Post('/badge')
    @UseInterceptors(FileInterceptor('media'))
    async createBadge(@UploadedFile() mediaFile: Express.Multer.File, @Query() queryDto: QueryDto) {
        return this.adminService.createBadge(mediaFile, queryDto);
    }

    @Delete('/badge/:id')
    async removeBadge(@Param('id') id: string) {
        return this.adminService.removeBadge(id);
    }

    @Put('/badge/:id')
    @UseInterceptors(FileInterceptor('media'))
    async editBadge(@Param('id') id: string, @UploadedFile() mediaFile: Express.Multer.File, @Query() queryDto: QueryDto) {
        return this.adminService.editBadge(id, queryDto, mediaFile);
    }

    //////////////////////////////////// filters

    @Post('/categories')
    async createCategory(@Body('category') category) {
        return this.categoryService.createCategory(category);
    }

    @Post('/categories/filter')
    async addFilter(@Body() dto) {
        return this.categoryService.addFilter(dto.filterName, dto.categoryName);
    }

    @Post('/categories/value')
    async addFilterValue(@Body() dto) {
        return this.categoryService.addFilterValue(dto.filterValue, dto.filterName, dto.categoryName);
    }

    @Get('/categories')
    async getFilters() {
        return this.categoryService.getFilters();
    }

    @Get('/cities')
    async getCities() {
        return this.adminService.getCities();
    }
}
