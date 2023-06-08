import { Body, Controller, Delete, Get, Param, Post, Put, Redirect } from "@nestjs/common";
import { PutFavoriteDto } from "./dto/put-favorite.dto";
import { UpdateHistoryDto } from "./dto/update-history.dto";
import { UpdateSettingsDto } from "./dto/update-settings.dto";
import { UserService } from "./user.service";


@Controller('api/users')
export class UserController {

    constructor(
        private userService: UserService,
    ) { }

    @Get('/activate/:activationLink')
    @Redirect("http://localhost:3000/authorization")
    async activate(@Param('activationLink') activationLink: string) {
        return await this.userService.activate(activationLink);
    }

    @Put('/favorites/add')
    addFavoriteBadge(@Body() putFavoriteDto: PutFavoriteDto): Promise<number[]> {
        return this.userService.addFavoriteProduct(putFavoriteDto);
    }

    @Put('/favorites/remove')
    removeFavoriteBadge(@Body() putFavoriteDto: PutFavoriteDto): Promise<number[]> {
        return this.userService.removeFavoriteBadge(putFavoriteDto);
    }

    @Put('/history')
    updateHistory(@Body() updateHistoryDto: UpdateHistoryDto) {
        return this.userService.updateHistory(updateHistoryDto);
    }

    @Put('/settings')
    updateUserSettings(@Body() updateSettingsDto: UpdateSettingsDto) {
        return this.userService.updateUserSettings(updateSettingsDto);
    }

}