import { Body, Controller, Get, Param, Post, Put, Redirect, UseGuards, Req, Res } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { Response } from "express";
import uuid from 'uuid';

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
            return await this.mailService.sendActivationLink(user.email, `${process.env.API_URL}/auth/activate/${user.activationLink}`);
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
                sameSite: "none",
            })
            response.cookie("accessToken", accessToken, {
                maxAge:  24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "none",
            })
            return user;
        }
    }

    @Get('/activate/:activationLink')
    @Redirect("https://shop-types.vercel.app/authorization")
    async activate(@Param('activationLink') activationLink: string) {
        return await this.authService.activate(activationLink);
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
            sameSite: "none",
        })
        res.cookie("accessToken", tokens.accessToken, {
            maxAge:  24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        })

        return {ok: 'ok'}
    }

    @Put('/reset/:userEmail')
    async sendResetLink(@Param('userEmail') userEmail: string) {
        const resetLink = await this.authService.sendResetLink(userEmail);
        return await this.mailService.sendResetLink(userEmail, `${process.env.API_URL}/auth/reset/${resetLink}`);
    }
    
    @Get('/reset/:resetLink')
    async reset(
        @Res({ passthrough: true }) response: Response,
        @Param('resetLink') resetLink: string,
    ) {
        response.redirect(`${process.env.CLIENT_URL}/reset/${resetLink}`);
    }

    @Post('/reset')
    async resetPassword(@Body() resetPasswordDto) {
        return await this.authService.resetPassword(resetPasswordDto);
    }
    
}