import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ensureDir, writeFile, remove } from 'fs-extra';
import { City, CityDocument } from "../schemas/city.schema";
import { Product, ProductDocument } from "../schemas/product.schema";
const uploadFolder = `uploads/images`;
@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Product.name) private badgeModel: Model<ProductDocument>,
        @InjectModel(City.name) private cityModel: Model<CityDocument>,
    ) { }

    async createBadge(mediaFile: Express.Multer.File, queryDto) {
        await ensureDir(uploadFolder);
        await writeFile(`${uploadFolder}/${mediaFile.originalname}`, mediaFile.buffer)
        const imagePath = `uploads/images/${mediaFile.originalname}`;
        const badge = { ...queryDto, imagePath, views: 0, purchases: 0 };
        badge.parameters = badge.parameters.map(item => JSON.parse(item));

        const addedBadge = await this.badgeModel.create(badge)
        
        return addedBadge;
    }

    async removeBadge(id: string) {
        await this.badgeModel.deleteOne({_id: id});
        return id;
    }

    async editBadge(id: string, dto, mediaFile) {

        const badge = await this.badgeModel.findOne({_id: id});
        let imagePath = badge.imagePath;
        if(mediaFile) {
            await ensureDir(uploadFolder);
            await remove(badge.imagePath);
            await writeFile(`${uploadFolder}/${mediaFile.originalname}`, mediaFile.buffer)
            imagePath = `uploads/images/${mediaFile.originalname}`;
        }
        dto.parameters = dto.parameters.map((item:any) => JSON.parse(item));
   
        await this.badgeModel.findOneAndUpdate(
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

        return await this.badgeModel.find();
    }

    async getCities() {
        return this.cityModel.find();
    }
}