import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UsersService } from '../users.service';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: string, args: ValidationArguments) {
    const user = await this.usersService.findByProperties({
      [args.property]: value,
    });

    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return `User with this ${args.property} already exists.`;
  }
}
