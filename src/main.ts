import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from "cors";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ credentials: true, origin: true });
  await app.listen(4000, () => { console.log(`server port - 4000`) });
}
bootstrap();
