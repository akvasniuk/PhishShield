import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { ConfigService } from '@nestjs/config';

const verifyPromise = promisify(jwt.verify.bind(jwt));

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  generateTokenPair() {
    const accessToken = jwt.sign(
      {},
      this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      { expiresIn: this.configService.get<string>('ACCESS_TOKEN_TIME') });
    const refreshToken = jwt.sign(
      {},
      this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      { expiresIn: this.configService.get<string>('REFRESH_TOKEN_TIME'), });

    return {
      accessToken,
      refreshToken,
    };
  }

  async verifyToken(token: string,
                    tokenType: string = this.configService.get<string>('ACCESS')): Promise<void> {
    try {
      const secretWord = tokenType === this.configService.get<string>('ACCESS')
        ? this.configService.get<string>('ACCESS_TOKEN_SECRET')
        : this.configService.get<string>('REFRESH_TOKEN_SECRET');

      await verifyPromise(token, secretWord);
    } catch (e) {
      throw new UnauthorizedException(e.message || 'Token verification failed');
    }
  }

  generateEmailToken() {
    const emailToken = jwt.sign(
      {},
      this.configService.get<string>('EMAIL_TOKEN_SECRET'),
      { expiresIn: this.configService.get<string>('EMAIL_TOKEN_TIME')});

    return {
      emailToken,
    };
  }

  async verifyEmailToken(token: string): Promise<void> {
    try {
      await verifyPromise(token, this.configService.get<string>('EMAIL_TOKEN_SECRET'));
    } catch (e) {
      throw new UnauthorizedException(e.message || 'Email token verification failed');
    }
  }

  generatePasswordToken() {
    const passwordToken = jwt.sign(
      {},
      this.configService.get<string>('PASSWORD_TOKEN_SECRET'),
      { expiresIn: this.configService.get<string>('PASSWORD_TOKEN_TIME') });

    return {
      passwordToken,
    };
  }

  async verifyPasswordToken(token: string): Promise<void> {
    try {
      await verifyPromise(token, this.configService.get<string>('PASSWORD_TOKEN_SECRET'));
    } catch (e) {
      throw new UnauthorizedException(e.message || 'Password token verification failed');
    }
  }
}