import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { ConfigModule } from './config/config.module';
import { HealthModule } from './models/health/health.module';
import { UsersModule } from './models/users/users.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';

@Module({
  imports: [
    ConfigModule,
    CommonModule,
    PostgresDatabaseProviderModule,
    AuthModule,
    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}
