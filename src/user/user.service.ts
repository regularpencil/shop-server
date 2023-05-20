import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { PutFavoriteDto } from "./dto/put-favorite.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { User, UserDocument } from "../schemas/user.schema";
import { LoginUserDto } from "./dto/login-user.dto";
import * as bcrypt from 'bcrypt';
import { RegistrationUserDto } from "./dto/registration-user.dto";
import * as uuid from 'uuid';
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { Product, ProductDocument } from "src/schemas/productSchema.schema";

@Injectable()
export class UserService {

    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Product.name) private badgeModel: Model<ProductDocument>,
    ) {}

    async registration(dto: RegistrationUserDto) {
        const candidate = await this.userModel.findOne({ email: dto.email });
        if (candidate) {
            throw new HttpException("Пользователь с таким email уже существует", HttpStatus.BAD_REQUEST);
        }
        const hashPassword = await bcrypt.hash(dto.password, 3);
        const activationLink = uuid.v4();
        const user = await this.userModel.create({
            name: dto.name,
            email: dto.email,
            phoneNumber: dto.phoneNumber,
            password: hashPassword,
            role: "user",
            activationLink,
            favorites: [],
            history: [],
            orders: [],
        });

        return user;
    }

    async activate(activationLink: string) {
        const user = await this.userModel.findOne({ activationLink });
        if (!user) {
            throw new HttpException("Некорректная ссылка активации", 402);
        }

        await this.userModel.findOneAndUpdate({ activationLink }, { $set: { isActivated: true } });
        return { activate: true }
    }

    async addFavoriteBadge(putFavoriteDto: PutFavoriteDto): Promise<number[]> {
        const user = await this.userModel.findOne({ email: putFavoriteDto.email });
        const newFavorites = [...user.favorites, putFavoriteDto.badgeId];
        const userGrades = user.grades;

        const foundedGrade = userGrades.find(item => item.productId === putFavoriteDto.badgeId);

        if(foundedGrade) {
            if(foundedGrade.grade < 3) {
                foundedGrade.grade = 3;
            }
        } else {
            userGrades.push({productId: putFavoriteDto.badgeId, grade: 3});
        }
       
        await this.userModel.findOneAndUpdate({ email: putFavoriteDto.email }, { $set: { favorites: newFavorites, grades: userGrades } });

        return newFavorites;
    }

    async removeFavoriteBadge(dto: PutFavoriteDto): Promise<number[]> {
        const user = await this.userModel.findOne({ email: dto.email });
        const newFavorites = user.favorites.filter(badgeId => badgeId != dto.badgeId);
        await this.userModel.findOneAndUpdate({ email: dto.email }, { $set: { favorites: newFavorites } });
        return newFavorites;
    }

    async updateHistory(dto: UpdateHistoryDto) {
        console.log(dto);
        await this.badgeModel.findOneAndUpdate({_id: dto.badgeId}, {$inc:{views: 1}})
        const user = await this.userModel.findOne({ email: dto.email });
        const newHistoryBadge = user.history.find(id => id == dto.badgeId);
        const history = [...user.history];

        if (!newHistoryBadge) {
            history.unshift(dto.badgeId);
            if (history.length > 4) {
                history.pop();
            }
            await this.userModel.updateOne(
                { email: dto.email },
                { $set: { history } }
            );
        }

        return history;
    }

    async login(dto: LoginUserDto) {
        const user = await this.userModel.findOne({ email: dto.email });

        if (!user) {
            return new HttpException("Неверный логин или пароль", HttpStatus.BAD_REQUEST);
        }

        const isPassEqual = await bcrypt.compare(dto.password, user.password);

        if (!isPassEqual) {
            return new HttpException("Неверный логин или пароль", HttpStatus.BAD_REQUEST);
        }

        return user;
    }

    async updateUserSettings(dto: UpdateSettingsDto) {
        await this.userModel.findOneAndUpdate({ email: dto.email }, { $set: { name: dto.name, phoneNumber: dto.phoneNumber } });
        return { name: dto.name, phoneNumber: dto.phoneNumber };
    }
}