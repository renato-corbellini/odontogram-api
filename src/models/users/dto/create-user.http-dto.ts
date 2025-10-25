import {
  IsDateString,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserHttpDto {
  @IsString()
  @MinLength(2)
  readonly firstName: string;

  @IsString()
  @MinLength(2)
  readonly lastName: string;

  @IsString()
  @IsDateString()
  readonly dob: string;

  @IsString()
  @MinLength(5)
  @IsEmail()
  readonly email: string;

  @IsString()
  @MinLength(5)
  @MaxLength(50)
  readonly username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must be between 8 and 50 characters long and have at least one uppercase letter, one lowercase letter and a number',
  })
  password: string;
}
