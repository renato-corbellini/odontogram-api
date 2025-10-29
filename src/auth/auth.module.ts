import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from 'src/common/common.module';
import { AppConfigModule } from 'src/config/app/config.module';
import { UsersModule } from '../models/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MatchPasswordConstraint } from './dto/restore-password.http-dto';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    AppConfigModule,
    CommonModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, MatchPasswordConstraint],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
