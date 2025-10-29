import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { User } from 'src/models/users/entities/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    appConfig: AppConfigService,
  ) {
    super({
      secretOrKey: appConfig.env.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate({ id }: JwtPayload): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) throw new UnauthorizedException('Token not valid');
    if (!user.isActive) throw new UnauthorizedException('User is not active');
    return user; // This will be injected in the request object
  }
}
