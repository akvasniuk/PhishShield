import { AuthService } from './services/auth.service';
import { Body, Controller, Get, HttpCode, Param, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { IsUserExistsGuard } from '../users/guards/is-user-exists.guard';
import { IsPasswordValidGuard } from './guards/is-password-valid.guard';
import { IsUserActivatedGuard } from './guards/is-user-activated.guard';
import { LoginDto } from './dtos/login.dto';
import { CheckMailTokenGuard } from './guards/check-mail-token.guard';
import { CheckGoogleUserGuard } from './guards/check-google-user.guard';
import { AuthGoogleLoginDto } from './dtos/auth-google-login.dto';
import { AccessTokenGuard } from './guards/access-token.guard';
import { IsUserExistGuard } from './guards/is-user-exist.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { PasswordTokenGuard } from './guards/password-token.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('login')
  @UseGuards(IsUserExistGuard, IsPasswordValidGuard, IsUserActivatedGuard)
  async login(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })) loginDto: LoginDto,
    @Req() req: Request,
  ) {
    return await this.authService.login(req['user']);
  }

  @Get('activate/mail/:emailToken')
  @UseGuards(CheckMailTokenGuard)
  async activate(@Req() req: Request) {
    return await this.authService.activate(req['user']);
  }

  @Post('loginGoogle')
  @UseGuards(CheckGoogleUserGuard)
  async loginGoogle(@Body() loginDto: AuthGoogleLoginDto, @Req() req: Request) {
    if(req['user']){
     return req['user'];
   }
    return this.authService.loginGoogle(req['userInfo']);
  }

  @Post('logout/:userId')
  @HttpCode(204)
  @UseGuards(IsUserExistsGuard, AccessTokenGuard)
  async logout(@Param('userId') userId: string, @Req() req: Request) {
    await this.authService.logout(req['user'].accessToken);
    return 'SUCCESSFUL DELETED';
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(RefreshTokenGuard)
  async refresh(@Req() req: Request) {
    return await this.authService.refresh(req['user'], req['user'].refreshToken);
  }

  @Get('activate/password/:passwordToken')
  @HttpCode(200)
  @UseGuards(PasswordTokenGuard)
  async changePassword(@Req() req: Request) {
    return { changeTokenPassword: req['tokenObject'].passwordToken };
  }
}
