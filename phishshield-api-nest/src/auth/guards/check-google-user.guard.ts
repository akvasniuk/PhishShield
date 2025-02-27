import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { UsersRepository } from '../../users/user.repository';
import { AuthRepository } from '../auth.repository';
import { TokenService } from '../services/token.service';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { UserHelper } from '../../users/helpers/user.helper';

@Injectable()
export class CheckGoogleUserGuard implements CanActivate {
  private client: OAuth2Client;

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authRepository: AuthRepository,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
    private readonly userHelper: UserHelper
  ) {
    this.client = new OAuth2Client(this.configService.get<string>('GOOGLE_CLIENT_ID'));
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { credential, clientId } = request.body;

    const ticket = await this.client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const userInfo = ticket.getPayload();

    if (!userInfo) {
      throw new UnauthorizedException('Invalid Google token');
    }


    const userByEmail = await this.usersRepository.findUserByEmail(userInfo.email);

    if (userByEmail) {
      const { _id } = userByEmail;
      const tokenPair = this.tokenService.generateTokenPair();

      await this.authRepository.updateOne(tokenPair, _id as Types.ObjectId);
      const normalizedUser = this.userHelper.userNormalization(userByEmail);
      request.user = { ...tokenPair, user: normalizedUser };

      return true;
    }

    request.userInfo = userInfo;
    return true;
  }
}
