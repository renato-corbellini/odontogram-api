import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'src/common/bcrypt-adapter';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/';
import { FindByPropertiesDto } from './dto/find-by-properties.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ id: string }> {
    const { password, ...userDetails } = createUserDto;

    const user = this.usersRepository.create({
      ...userDetails,
      password: hash(password),
    });

    await this.usersRepository.save(user);

    return { id: user.id };

    // Todo: Send email verification
  }

  async findByProperties(
    findByPropertiesDto: FindByPropertiesDto,
  ): Promise<User | null> {
    return await this.usersRepository.findOne({
      where: findByPropertiesDto,
      select: ['id', 'username', 'email', 'password'],
    });
  }

  // checkAuthStatus(user: User) {
  //   try {
  //     return {
  //       user,
  //       token: this.getJwtToken({ id: user.id }),
  //     };
  //   } catch (error) {
  //     this.commonService.handleDBExceptions(error, this.logger, user);
  //   }
  // }
}
