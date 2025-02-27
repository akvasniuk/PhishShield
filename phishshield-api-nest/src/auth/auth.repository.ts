import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { OAuth } from './auth.schema';
import { OauthInterface } from './interfaces/oauth.interface';
import { TokenInterface } from './interfaces/token.interface';

@Injectable()
export class AuthRepository {
  constructor(@InjectModel(OAuth.name)
              private readonly authModel: Model<OAuth>) {
  }

  async getAuthByToken(token: string): Promise<OauthInterface> {
    return this.authModel.findOne({ accessToken: token });
  }

  async createToken(emailToken: string, userId: Types.ObjectId): Promise<OauthInterface> {
    return this.authModel.create({ emailToken, user: userId });
  }

  async updateOne(tokenPair: TokenInterface, _id: Types.ObjectId) {
    await this.authModel.updateOne({ user: _id }, { ...tokenPair });
  }

  async getAuthByMailToken(emailToken: string): Promise<OauthInterface> {
    return this.authModel.findOne({ emailToken });
  }

  async createTokenByUserId(userId: Types.ObjectId): Promise<OauthInterface> {
    return this.authModel.create({ user: userId });
  }

  async getAuthByAccessToken(accessToken: string): Promise<OauthInterface> {
    return this.authModel.findOne({ accessToken });
  }

  async deleteByAccessToken(accessToken: string) {
    await this.authModel.deleteOne({ accessToken });
  }

  async getAuthByRefreshToken(refreshToken: string): Promise<OauthInterface> {
    return this.authModel.findOne({ refreshToken });
  }

  async deleteByRefreshToken(refreshToken: string) {
    this.authModel.deleteOne({ refreshToken });
  }

  async getAuthByPasswordToken(passwordToken: string): Promise<OauthInterface> {
    return this.authModel.findOne({ passwordToken });
  }

  async updatePasswordToken(userId: string, passwordToken: string): Promise<void> {
    await this.authModel.updateOne({ user: userId }, { passwordToken });
  }

  async deleteTokensByUserId(userId: Types.ObjectId): Promise<void> {
    await this.authModel.deleteMany({ user: userId });
  }
}