import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { PORT } from './settings';
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(cookieParser());

  await app.listen(PORT);
}

bootstrap();
