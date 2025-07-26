import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getProfile(@Session() session: UserSession) {
    const user = await this.authService.findUserById(session.user.id);
    return { user };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  async getSession(@Session() session: UserSession) {
    return { session };
  }
}
