import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  app.use(cookieParser());
  app.enableCors({
    origin: [
      "https://shop-types.vercel.app",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  });
  await app.listen(4000, () => { console.log(`server port - 4000`) });
}
bootstrap();
