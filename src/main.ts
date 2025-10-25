import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(AppConfigService);

  await app.listen(configService.env.port);

  console.log(`App running on port ${configService.env.port} 🚀`);
}

bootstrap();
