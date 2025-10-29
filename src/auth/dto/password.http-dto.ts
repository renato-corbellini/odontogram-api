import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class PasswordHttpDto {
  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have at least one uppercase letter, one lowercase letter and a number',
  })
  password: string;
}
