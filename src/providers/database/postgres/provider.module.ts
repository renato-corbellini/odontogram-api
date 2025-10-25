import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { AppConfigModule } from 'src/config/app/config.module';
import {
  AppConfigService,
  EnvironmentEnum,
} from 'src/config/app/config.service';
import { DatabaseConfigModule } from 'src/config/database/config.module';
import { DatabaseConfigService } from 'src/config/database/config.service';
import { User } from 'src/models/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [DatabaseConfigModule, AppConfigModule],
      useFactory: (
        dbConfigService: DatabaseConfigService,
        appConfigService: AppConfigService,
      ) => {
        return {
          type: dbConfigService.env.engine,
          host: dbConfigService.env.host,
          port: dbConfigService.env.port,
          username: dbConfigService.env.username,
          password: dbConfigService.env.password,
          database: dbConfigService.env.databaseName,
          entities: [User],
          synchronize:
            appConfigService.env.environment === EnvironmentEnum.Local,
        };
      },
      inject: [DatabaseConfigService, AppConfigService],
    } as TypeOrmModuleAsyncOptions),
  ],
})
export class PostgresDatabaseProviderModule {}
