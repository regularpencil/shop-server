import { Controller, Get, Param, Res } from '@nestjs/common';

@Controller()
export class ImageController {
    @Get("/uploads/images/:filename")
    async getFile(@Param("filename") filename: string, @Res() res: any) {
        res.sendFile(filename, { root: 'uploads/images' });
    }
}
