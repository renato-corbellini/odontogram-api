import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Auth } from 'src/models/users/decorators';
import { User } from 'src/models/users/entities/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { LoginHttpDto, RequestPasswordRestoreHttpDto } from './dto';
import { RestorePasswordHttpDto } from './dto/restore-password.http-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Todo: decorator that searches user by identifier (email, username) and returns 401 if not found
  @Post('/login')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: LoginHttpDto) {
    return this.authService.login(dto);
  }

  // Todo: decorator that searches user by identifier (email, username) and returns 401 if not found
  @HttpCode(200)
  @Post('/request-password-restore')
  requestPasswordRestore(@Body() dto: RequestPasswordRestoreHttpDto) {
    return this.authService.requestPasswordRestore(dto);
  }

  // Todo: decorator that searches user by id and returns 401 if not found
  // Todo: decorator that validates auth token in request
  @Auth()
  @HttpCode(200)
  @Post('/restore-password')
  restorePassword(@GetUser() user: User, @Body() dto: RestorePasswordHttpDto) {
    return this.authService.restorePassword({ userId: user.id, ...dto });
  }
}
