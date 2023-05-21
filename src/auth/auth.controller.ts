import { Body, Controller, Get, Param, Post, Put, Redirect } from "@nestjs/common";
import { MailService } from "../mail/mail.service";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dto/login-user.dto";
import { CreateUserDto } from "./dto/create-user.dto";

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
    async login(@Body() loginUserDto: LoginUserDto) {
        return this.authService.login(loginUserDto);
    }

    @Get('/activate/:activationLink')
    @Redirect("http://localhost:3000/authorization")
    async activate(@Param('activationLink') activationLink: string) {
        return await this.authService.activate(activationLink);
    }
}