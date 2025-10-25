import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Equals, IsEnum, IsNumber, IsString } from 'class-validator';
import { validateSchema } from '../config.validate';
import {
  AppConfigService,
  EnvironmentEnum,
  LogLevelEnum,
} from './config.service';

class EnvVariablesSchema {
  @IsString()
  ALLOWED_ORIGINS: string;

  @IsNumber()
  PORT: number;

  @IsEnum(EnvironmentEnum)
  ENVIRONMENT: string;

  @Equals('odontogram-api')
  SERVICE_NAME: string;

  @IsEnum(LogLevelEnum)
  LOG_LEVEL: string;

  @IsString()
  JWT_SECRET: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.test'],
      validate: (config) => validateSchema(config, EnvVariablesSchema),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService, ConfigModule],
})
export class AppConfigModule {}
