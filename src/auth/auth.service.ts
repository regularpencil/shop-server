import { HttpCode, HttpStatus, Injectable } from "@nestjs/common";
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
import { Token, TokenDocument } from "src/schemas/token.schema";


@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
        @InjectModel(Token.name) private tokenModel: Model<TokenDocument>,
        private jwtService: JwtService,
    ) { }

    async registration(createUserDto: CreateUserDto) {
        const candidate = await this.userModel.findOne({ email: createUserDto.email });

        if (candidate) {
            throw new HttpException("Пользователь с таким email уже существует", 460);
        }

        const hashPassword = await bcrypt.hash(createUserDto.password, 3);
        const activationLink = uuid.v4();

        const user = await this.userModel.create({
            name: createUserDto.name,
            email: createUserDto.email,
            password: hashPassword,
            activationLink,
            role: 'user',
            favorites: [],
            history: [],
            grades: [],
        });

        if(user) {
            await this.chatModel.create({userEmail: createUserDto.email, chatName:"Тех. поддержка", messages: []})
            await this.chatModel.create({userEmail: createUserDto.email, chatName:"Заказы", messages: []})
        }

        return user
    }

    async createTokens(email) {
        const payload = {email};

        const accessToken = await this.jwtService.signAsync(
            payload,
            {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '10m',
            }
        )

        const refreshToken = await this.jwtService.signAsync(
            payload,
            {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '60d',
            }
        )
  
        return {
            accessToken,
            refreshToken
        }
    }

    private async extractUserInfo(user) {
        return {
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            favorites: user.favorites,
            history: user.history,
            isActivated: user.isActivated,
            grades: user.grades,
        }
    }
    

    async login(dto: LoginUserDto): Promise<any> {
        const user = await this.userModel.findOne({ email: dto.email });

        if (!user) {
            return new HttpException("Неверный логин или пароль", HttpStatus.BAD_REQUEST);
        }

        const isPassEqual = await bcrypt.compare(dto.password, user.password);

        if (!isPassEqual) {
            return new HttpException("Неверный логин или пароль", HttpStatus.BAD_REQUEST);
        }


        const tokens = await this.createTokens(user.email);
        const userDto = await this.extractUserInfo(user);
   
        const refresh = await this.tokenModel.findOne({userEmail: user.email});
  
        if(refresh) {
            await this.tokenModel.updateOne({userEmail: dto.email, refreshToken: tokens.refreshToken});
        } else {
            await this.tokenModel.create({userEmail: dto.email, refreshToken: tokens.refreshToken});
        }

        return {user: userDto, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}
    }

    async activate(activationLink: string) {
        const user = await this.userModel.findOne({ activationLink });
        if (!user) {
            throw new HttpException("Некорректная ссылка активации", 402);
        }

        await this.userModel.findOneAndUpdate({ activationLink }, { $set: { isActivated: true } });
        return { activate: true }
    }

    async refresh(refreshToken): Promise<any> {

        const refresh = await this.tokenModel.findOne({refreshToken});
        console.log(refresh);
        if(!refresh) {
            return new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
        }

        const tokens = await this.createTokens(refresh.userEmail);
        await this.tokenModel.findOneAndUpdate({refreshToken}, {refreshToken: tokens.refreshToken});
        return tokens;
    }
}