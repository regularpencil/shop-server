import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from "cors";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    credentials: true,
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  });
  await app.listen(4000, () => { console.log(`server port - 4000`) });
}
bootstrap();
