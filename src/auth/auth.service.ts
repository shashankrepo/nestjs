import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  login() {
    return {
      message: "I'm logged in!",
    };
  }

  register() {
    return {
      message: "I'm signed up!",
    };
  }
}
