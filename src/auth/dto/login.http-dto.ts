import { IntersectionType } from '@nestjs/mapped-types';
import { IdentifierHttpDto } from './identifier.http-dto';
import { PasswordHttpDto } from './password.http-dto';

export class LoginHttpDto extends IntersectionType(
  IdentifierHttpDto,
  PasswordHttpDto,
) {}
