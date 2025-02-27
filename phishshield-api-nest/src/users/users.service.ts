import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './user.repository';
import { UserHelper } from './helpers/user.helper';
import { UploadedFile } from 'express-fileupload';
import { PasswordHelper } from './helpers/password.helper';
import { AuthRepository } from '../auth/auth.repository';
import { TokenService } from '../auth/services/token.service';
import { Types } from 'mongoose';
import { MailService } from '../mail/mail.service';
import { EmailActionsEnum } from '../mail/constants/email-actions.enum';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { promises as fs } from 'fs';
import { User } from './user.schema';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserInterface } from './interfaces/user.interface';
import * as path from 'node:path';
import { CustomRequest } from './interfaces/custom-request.interface';
import { Express } from 'express';

async function removeDirectory(path: string): Promise<void> {
  await fs.rm(path, { recursive: true, force: true });
}

async function deleteFile(filePath: string): Promise<void> {
  await fs.unlink(filePath);
}

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
    private readonly usersHelper: UserHelper,
    private readonly passwordHelper: PasswordHelper,
    private readonly tokenService: TokenService,
    private readonly authRepository: AuthRepository,
    private readonly mailService: MailService
  ) {
  }

  public async createUser(createUserDto: CreateUserDto, avatar?: UploadedFile): Promise<User> {
    createUserDto.password = await this.passwordHelper.hash(createUserDto.password);
    const { emailToken } = this.tokenService.generateEmailToken();

    const createdUser = await this.usersRepository.insertUser(createUserDto);
    await this.authRepository.createToken(emailToken, createdUser._id as Types.ObjectId);

    await this.mailService.sendMail(createUserDto.email, EmailActionsEnum.VERIFY_ACCOUNT, {
      userName: createUserDto.firstname,
      emailToken,
      port: this.configService.get<string>('PORT'),
    });

    if (avatar) {
      const API_KEY = this.configService.get<string>('FILE_API_KEY');
      const formData = new FormData();
      const fileBuffer = await fs.readFile(avatar.tempFilePath);
      formData.append('image', fileBuffer.toString('base64'));

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await this.usersRepository.updateUser(createdUser._id as Types.ObjectId, {
        avatar: response.data.data.image.url,
      });
    }

    return createdUser;
  }

  public async getAllUsersWithPagination(
    page: number,
    perPage: number,
  ) {
    const usersCount = await this.usersRepository.countUsers();
    const users = await this.usersRepository.getUsers(page, perPage);

    const normalizedUsers = users.map(user => this.usersHelper.userNormalization(user));

    return {
      users: normalizedUsers,
      page,
      pages: usersCount ? Math.ceil(usersCount / perPage) : 1,
      totalCount: usersCount,
    };
  }

  async getChatUsers(userId: string, isAdmin: boolean) {
    return  await this.usersRepository.getAllUsersByParam(userId, isAdmin);
  }

  async softDeleteUserByAdmin(user: User) {
    const userForDelete = await this.usersRepository.findUser({ _id: user._id as Types.ObjectId });

    const deletedUser = await this.usersRepository.deleteUser(userForDelete);
    await this.usersRepository.updateUser(user._id as Types.ObjectId, deletedUser);
    await this.authRepository.deleteTokensByUserId(user._id as Types.ObjectId);

    await this.mailService.sendMail(deletedUser.email, EmailActionsEnum.DELETE_USER, {
      userName: deletedUser.firstname,
      img: "DELETE_IMAGE"
    });

    return { message: 'User deleted successfully' };
  }

  async updateUserDetailsByAdmin(userId: string, updateData: any): Promise<void> {
    if (updateData.password) {
      updateData.password = await this.passwordHelper.hash(updateData.password);
    }

    const userForUpdate = await this.usersRepository.findUserById(userId);
    await this.usersRepository.updateUser(userForUpdate._id as Types.ObjectId, updateData);
    await this.mailService.sendMail(userForUpdate.email, EmailActionsEnum.UPDATE_USER, {
      userName: userForUpdate.firstname,
      img: 'UPDATE_IMAGE',
    });
  }

  async softDeleteUser(user: User, token: string): Promise<void> {
    const deletedUser = await this.usersRepository.deleteUser(user);
    await this.usersRepository.updateUser(user._id as Types.ObjectId, deletedUser);

    await this.authRepository.deleteByAccessToken(token);
    await this.mailService.sendMail(user.email, EmailActionsEnum.DELETE_USER, {
      userName: user.firstname,
      img: 'DELETE_IMAGE',
    });
  }

  async updateUserDetails(user: User, updateData: UpdateUserDto): Promise<void> {
    if (updateData.password) {
      updateData.password = await this.passwordHelper.hash(updateData.password);
    }

    await this.usersRepository.updateUser(user._id as Types.ObjectId, updateData);
    await this.mailService.sendMail(user.email, EmailActionsEnum.UPDATE_USER, {
      userName: user.firstname,
      img: 'UPDATE_IMAGE',
    });
  }

  async verifyToChangePassword(user: User): Promise<void> {
    const { _id, firstname, email } = user;
    await this.usersRepository.verifyToChangePassword(user);

    const { passwordToken } = this.tokenService.generatePasswordToken();

    await this.authRepository.updatePasswordToken(_id as string, passwordToken);
    await this.mailService.sendMail(email, EmailActionsEnum.CHANGE_PASSWORD, {
      userName: firstname,
      passwordToken,
    });
  }

  async changePassword(user: User, password: string, passwordToken: string) {
    await this.tokenService.verifyPasswordToken(passwordToken);

    const hashedPassword = await this.passwordHelper.hash(password);
    await this.usersRepository.updateUser(user._id as Types.ObjectId, { password: hashedPassword });
  }

  async updateOrDeleteUserAvatar(req: CustomRequest, url: string): Promise<string> {
    const { user, avatar } = req;
    const userId = user._id.toString();

    if (!avatar) {
      throw new BadRequestException('No avatar file provided');
    }

    if (url.includes('delete')) {
      return await this.deleteAvatar(user as UserInterface);
    }

    return await this.uploadAvatar(userId, avatar, user as UserInterface);
  }

  private async deleteAvatar(user: UserInterface): Promise<string> {
    const userId = user._id.toString();
    const avatarPath = path.join(process.cwd(), 'static', 'users', userId, 'avatar');

    await removeDirectory(avatarPath);

    if (user.avatarPhotos?.length) {
      await removeDirectory(path.join(process.cwd(), 'static', user.avatarPhotos[user.avatarPhotos.length - 1]));
      user.avatarPhotos.pop();
      await this.usersRepository.updateUser(user._id as Types.ObjectId, {
        avatar: user.avatarPhotos[user.avatarPhotos.length - 1] || null,
        avatarPhotos: user.avatarPhotos,
      });
    }
    return 'DELETED';
  }

  private async uploadAvatar(userId: string, avatar: Express.Multer.File, user: UserInterface): Promise<string> {
    const API_KEY = this.configService.get<string>('FILE_API_KEY');
    const formData = new FormData();
    const fileBuffer = avatar.buffer;
    formData.append('image', fileBuffer.toString('base64'));

    const response = await axios.post(`https://api.imgbb.com/1/upload?key=${API_KEY}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    await this.usersRepository.updateUser(user._id as Types.ObjectId, {
      avatar: response.data.data.image.url,
    });

    return 'UPDATED';
  }
}
