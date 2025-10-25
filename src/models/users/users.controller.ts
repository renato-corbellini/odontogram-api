import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserHttpDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserHttpDto) {
    return this.usersService.create(createUserDto);
  }

  // @Get('private-route')
  // @UseGuards(AuthGuard())
  // testingPrivateRoute(
  //   @GetUser() user: User,
  //   @GetUser('email') userEmail: string,
  //   @GetUser(['email', 'firstName']) userData: string,
  //   @RawHeaders() headers: string[],
  // ) {
  //   return { user, userEmail, userData, headers };
  // }

  // @SetMetadata('roles', ['admin', 'super-user'])

  // @Get('private2')
  // @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  // @UseGuards(AuthGuard(), UserRoleGuard)
  // testingPrivateRoute2(@GetUser() user: User) {
  //   return { user };
  // }

  // @Get('private3')
  // @Auth(ValidRoles.superUser, ValidRoles.admin)
  // testingPrivateRoute3(@GetUser() user: User) {
  //   return { user };
  // }
}
