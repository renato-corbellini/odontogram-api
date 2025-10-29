import { Injectable } from '@nestjs/common';
import { IntersectionType } from '@nestjs/mapped-types';
import {
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PasswordHttpDto } from './password.http-dto';

@Injectable()
@ValidatorConstraint({ name: 'matchPassword', async: false })
export class MatchPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const relatedValue = (args.object as PasswordHttpDto).password;
    return value === relatedValue;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}

export class RestorePasswordHttpDto extends IntersectionType(PasswordHttpDto) {
  @IsString()
  @Validate(MatchPasswordConstraint)
  confirmPassword: string;
}
