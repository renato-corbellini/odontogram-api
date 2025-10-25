import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { AppConfigModule } from '../app/config.module';
import { validateSchema } from '../config.validate';
import { DatabaseConfigService } from './config.service';

class EnvVariablesSchema {
  @IsString()
  DATABASE_ENGINE: string;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_USERNAME: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;
}

@Module({
  imports: [AppConfigModule],
  providers: [
    {
      provide: DatabaseConfigService,
      useFactory: (configService: ConfigService) => {
        validateSchema(process.env, EnvVariablesSchema);
        return new DatabaseConfigService(configService);
      },
      inject: [ConfigService],
    },
  ],
  exports: [DatabaseConfigService],
})
export class DatabaseConfigModule {}
