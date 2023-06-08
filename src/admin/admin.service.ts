import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ensureDir, writeFile, remove } from 'fs-extra';
import { City, CityDocument } from "../schemas/city.schema";
import { Product, ProductDocument } from "../schemas/product.schema";
import path from "path";

const uploadFolder = path.join(process.cwd(), 'uploads/images');;
@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Product.name) private productModel: Model<ProductDocument>,
        @InjectModel(City.name) private cityModel: Model<CityDocument>,
    ) { }

    async createProduct(mediaFile: Express.Multer.File, queryDto) {
        await ensureDir(uploadFolder);
        await writeFile(`${uploadFolder}/${mediaFile.originalname}`, mediaFile.buffer)
        const imagePath = `uploads/images/${mediaFile.originalname}`;
        const badge = { ...queryDto, imagePath, views: 0, purchases: 0 };
        badge.parameters = badge.parameters.map(item => JSON.parse(item));

        const addedBadge = await this.productModel.create(badge)
        
        return addedBadge;
    }

    async removeProduct(id: string) {
        await this.productModel.deleteOne({_id: id});
        return id;
    }

    async editProduct(id: string, dto, mediaFile) {

        const badge = await this.productModel.findOne({_id: id});
        let imagePath = badge.imagePath;
        if(mediaFile) {
            await ensureDir(uploadFolder);
            await remove(badge.imagePath);
            await writeFile(`${uploadFolder}/${mediaFile.originalname}`, mediaFile.buffer)
            imagePath = `uploads/images/${mediaFile.originalname}`;
        }
        dto.parameters = dto.parameters.map((item:any) => JSON.parse(item));
   
        await this.productModel.findOneAndUpdate(
            {_id: id}, 
            {
                $set: {
                    name: dto.name,
                    price: dto.price,
                    description: dto.description,
                    parameters: dto.parameters,
                    imagePath,
                }
            }
        )

        return await this.productModel.find();
    }

    async getCities() {
        return this.cityModel.find();
    }
}