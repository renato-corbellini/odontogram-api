import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { AppConfigModule } from './app/config.module';
import { DatabaseConfigModule } from './database/config.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    AppConfigModule,
    DatabaseConfigModule,
  ],
  exports: [AppConfigModule, DatabaseConfigModule],
})
export class ConfigModule {}
