import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService: AppConfigService = app.get(AppConfigService);

  app.useGlobalPipes(new ValidationPipe());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(appConfigService.env.port);

  console.log(`App running on port ${appConfigService.env.port} 🚀`);
}

bootstrap();
