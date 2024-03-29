import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser('') user: User) {
    return user;
  }

  @Patch('edit')
  editUser(@GetUser('id') userId: string, @Body() dto: UserDto) {
    return this.userService.editUser(userId, dto);
  }
}
