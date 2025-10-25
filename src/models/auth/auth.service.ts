import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'src/common/bcrypt-adapter';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username, email, password } = loginDto;

    const propertyToSearchBy = username ? 'username' : 'email';

    const user = await this.usersService.findByProperties({
      [propertyToSearchBy]: username || email,
    });

    if (!user || !compare(password, user.password))
      throw new UnauthorizedException();

    return {
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
