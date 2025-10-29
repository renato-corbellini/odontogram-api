import { IntersectionType } from '@nestjs/mapped-types';
import { IdentifierHttpDto } from './identifier.http-dto';

export class RequestPasswordRestoreHttpDto extends IntersectionType(
  IdentifierHttpDto,
) {}
