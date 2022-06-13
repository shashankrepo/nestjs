import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  editUser(userId: string, dto: UserDto) {
    console.log({ dto });
    const user = this.prisma.user.update({
      where: {
        id: userId,
      },
      data: { ...dto },
      select: { id: true },
    });

    return user;
  }
}
