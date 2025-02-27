import { Inject, Injectable, forwardRef } from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { UserInterface } from '../../users/interfaces/user.interface';
import { TokenService } from './token.service';
import { AuthRepository } from '../auth.repository';
import { Types } from 'mongoose';
import { UserHelper } from '../../users/helpers/user.helper';
import { User } from '../../users/user.schema';
import { UsersRepository } from '../../users/user.repository';
import { MailService } from '../../mail/mail.service';
import { EmailActionsEnum } from '../../mail/constants/email-actions.enum';
import { GoogleUserInterface } from '../interfaces/google-user.interface';
import { PasswordHelper } from '../../users/helpers/password.helper';
import { SocketGateway } from 'src/gateway/socket.gateway';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly userHelper: UserHelper,
    private readonly usersRepository: UsersRepository,
    private readonly mailService: MailService,
    private readonly passwordHelper: PasswordHelper,
    private readonly socketGateway: SocketGateway
  ) {
  }

  public async login(user: User) {
    const { _id } = user;
    const tokenPair = this.tokenService.generateTokenPair();

    await this.authRepository.updateOne(tokenPair, _id as Types.ObjectId);

    const normalizedUser = this.userHelper.userNormalization(user.toJSON());

    return { ...tokenPair, user: normalizedUser };
  }

  async activate(user: User): Promise<string> {
    const { email, firstname, _id } = user;
    await this.usersRepository.updateUser(_id as Types.ObjectId, { isUserActivated: true });
    await this.mailService.sendMail(email, EmailActionsEnum.WELCOME, { userName: firstname, img: 'REGISTER_IMAGE' });

    return 'Account successfully activated!';
  }

  async loginGoogle(userInfo: GoogleUserInterface) {
    const user = {
      firstname: userInfo?.given_name,
      lastname: userInfo?.family_name,
      email: userInfo?.email,
      isUserActivated: true,
      avatar: userInfo?.picture,
      isGoogleAuth: true,
    };

    const hashedPassword = await this.passwordHelper.hash(userInfo?.picture);
    const insertedUser = await this.usersRepository.insertUser({ ...user, password: hashedPassword });

    await this.authRepository.createTokenByUserId(insertedUser._id as Types.ObjectId);

    const tokenPair = this.generateTokenPair();
    await this.authRepository.updateOne(tokenPair, insertedUser._id as Types.ObjectId);

    return { ...tokenPair, user: insertedUser };
  }

  generateTokenPair() {
    return {
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    };
  }

  async logout(accessToken: string, userId?: string) {
    await this.authRepository.deleteByAccessToken(accessToken);
    this.socketGateway.removeUser(userId);
  }

  async refresh(user: User, refreshToken: string) {
    const tokenPair = this.tokenService.generateTokenPair();

    await this.authRepository.deleteByRefreshToken(refreshToken);
    await this.authRepository.updateOne(tokenPair, user._id as Types.ObjectId);

    return { ...tokenPair, user };
  }
}
