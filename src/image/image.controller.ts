import { Controller, Get, Param, Res } from '@nestjs/common';
import * as path from 'path';
@Controller()
export class ImageController {
    @Get("/uploads/images/:filename")
    async getFile(@Param("filename") filename: string, @Res() res: any) {
        const rootDirectory = path.join(process.cwd(), 'uploads/images');
        res.sendFile(filename, { root: rootDirectory });
    }
}
