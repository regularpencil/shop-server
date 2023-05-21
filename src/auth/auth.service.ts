import { HttpStatus, Injectable } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "../schemas/user.schema";
import { Model } from "mongoose";
import { LoginUserDto } from "./dto/login-user.dto";
import { Chat, ChatDocument } from "../schemas/chat.schema";
import { JwtService } from "@nestjs/jwt/dist";
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        private jwtService: JwtService,
    ) { }

    async registration(dto: CreateUserDto) {
        const candidate = await this.userModel.findOne({ email: dto.email });

        if (candidate) {
            throw new HttpException("Пользователь с таким email уже существует", 460);
        }

        const hashPassword = await bcrypt.hash(dto.password, 3);
        const activationLink = uuid.v4();

        const user = await this.userModel.create({
            name: dto.name,
            email: dto.email,
            password: hashPassword,
            activationLink,
            role: 'user',
            favorites: [],
            history: [],
            grades: [],
        });

        if(user) {
            await this.chatModel.create({userEmail: dto.email, chatName:"Тех. поддержка", messages: []})
            await this.chatModel.create({userEmail: dto.email, chatName:"Заказы", messages: []})
        }

        return user
    }

    private async generateToken(user) {
        const payload = {email: user.email, _id: user._id, role: user.role};

        return {
            token: this.jwtService.sign(payload),
        }
    }

    private async validateUser(userDto) {
        const user = await this.userModel.find({email: userDto.email});
        
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

    async activate(activationLink: string) {
        const user = await this.userModel.findOne({ activationLink });
        if (!user) {
            throw new HttpException("Некорректная ссылка активации", 402);
        }

        await this.userModel.findOneAndUpdate({ activationLink }, { $set: { isActivated: true } });
        return { activate: true }
    }
}