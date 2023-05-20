import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { RecommendationService } from "./recommendation.service";

@Controller('/api/recommendation')
export class RecommendationController {

    constructor(
        private recommendationService: RecommendationService
    ) {}
    
    @Get('/:userEmail')
    getRecomendation(@Param('userEmail') userEmail: string) {
        return this.recommendationService.getRecomendation(userEmail);
    }
    
}