import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import {
  AuthInterface,
  AuthRefreshToken,
  AuthUserProperties,
} from './interfaces/auth.interface';

@Controller('auth')
export class AuthController implements AuthInterface {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    return;
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Request() req: AuthUserProperties) {
    return this.authService.googleLoginCallback(req);
  }

  @Post('refresh')
  refresh(@Body() body: AuthRefreshToken) {
    return this.authService.refresh(body);
  }
}
