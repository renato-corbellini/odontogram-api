import { IsString, MaxLength, MinLength } from 'class-validator';

export class IdentifierHttpDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  identifier: string;
}
