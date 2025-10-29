import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CryptographyService } from '../../common/cryptography/cryptography.service';
import { CreateUserDto } from './dto/';
import { FindByPropertiesDto } from './dto/find-by-properties.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly cryptographyService: CryptographyService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<{ id: string }> {
    const { password, ...userDetails } = createUserDto;

    const user = this.usersRepository.create({
      ...userDetails,
      password: this.cryptographyService.hash(password),
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

  async updatePassword({
    userId,
    password,
  }: {
    userId: string;
    password: string;
  }) {
    await this.usersRepository.update(
      { id: userId },
      {
        password: this.cryptographyService.hash(password),
      },
    );
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
