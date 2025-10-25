import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class LoginHttpDto {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  @ValidateIf((o) => !o.email)
  readonly username?: string;

  @IsString()
  @MinLength(5)
  @IsEmail()
  @ValidateIf((o) => !o.username)
  readonly email?: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have at least one uppercase letter, one lowercase letter and a number',
  })
  password: string;
}
