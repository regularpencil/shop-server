import { Body, Controller, Get, Param, Post, Put, Redirect, UseGuards, Req, Res } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { Response } from "express";

@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private mailService: MailService
    ) { }

    @Post('/registration')
    async registration(@Body() registrationUserDto: CreateUserDto) {
        const user = await this.authService.registration(registrationUserDto);

        if (user) {
            return await this.mailService.sendActivationLink(user.email, `http://localhost:4000/api/users/activate/${user.activationLink}`);
        }
    }

    @Put('/login')
    async login(
        @Res({ passthrough: true }) response: Response,
        @Body() loginUserDto: LoginUserDto
    ) {
        const data = await this.authService.login(loginUserDto);
        const {user, accessToken, refreshToken} = data;
        if(data) {
            response.cookie("refreshToken", refreshToken, {
                maxAge: 60 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            })
            response.cookie("accessToken", accessToken, {
                maxAge:  24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
            })
            return user;
        }
    }

    @Get('/activate/:activationLink')
    @Redirect(`${process.env.CLIENT_URL}/authorization`)
    async activate(@Param('activationLink') activationLink: string) {
        return await this.authService.activate(activationLink);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('test')
    async test () {
        return {priv:"chodel"}
    }

    @Get('/refresh')
    async refresh(
        @Req() req,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = req.cookies.refreshToken;
        const tokens = await this.authService.refresh(refreshToken);

        res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: 60 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
        })
        res.cookie("accessToken", tokens.accessToken, {
            maxAge:  24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
        })

        return {ok: 'ok'}
    }
}