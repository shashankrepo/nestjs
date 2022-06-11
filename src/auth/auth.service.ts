import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
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
