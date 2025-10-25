import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './models/auth/auth.module';
import { HealthModule } from './models/health/health.module';
import { UsersModule } from './models/users/users.module';
import { PostgresDatabaseProviderModule } from './providers/database/postgres/provider.module';

@Module({
  imports: [
    ConfigModule,
    PostgresDatabaseProviderModule,
    AuthModule,
    HealthModule,
    UsersModule,
  ],
})
export class AppModule {}
