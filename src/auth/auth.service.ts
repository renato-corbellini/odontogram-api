import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isEmail } from 'class-validator';
import { CryptographyService } from '../common/cryptography/cryptography.service';
import { EmailService } from '../common/email/email.service';
import { UsersService } from '../models/users/users.service';
import { LoginDto, RequestPasswordRestoreDto } from './dto';
import { RestorePasswordDto } from './dto/restore-password.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptographyService: CryptographyService,
    private readonly usersService: UsersService,
    private readonly emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto) {
    const { identifier, password } = loginDto;

    const propertyToSearchBy = this.getPropertyToSearchBy(identifier);

    const user = await this.usersService.findByProperties({
      [propertyToSearchBy]: identifier,
    });

    if (!user || !this.cryptographyService.compare(password, user.password))
      throw new UnauthorizedException();

    return {
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getPropertyToSearchBy(identifier: string) {
    return isEmail(identifier) ? 'email' : 'username';
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async requestPasswordRestore(dto: RequestPasswordRestoreDto) {
    const { identifier } = dto;

    const propertyToSearchBy = this.getPropertyToSearchBy(identifier);

    const user = await this.usersService.findByProperties({
      [propertyToSearchBy]: identifier,
    });

    if (!user) throw new UnauthorizedException();

    await this.emailService.sendRestorePassword(user);

    return {
      restoreToken: this.getJwtToken({ id: user.id }),
    };
  }

  async restorePassword(dto: RestorePasswordDto) {
    const { userId, password } = dto;

    const user = await this.usersService.findByProperties({
      id: userId,
    });

    if (!user) throw new UnauthorizedException();

    await this.usersService.updatePassword({
      userId,
      password,
    });
  }
}
