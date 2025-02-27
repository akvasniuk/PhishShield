import {
  Body,
  Controller,
  DefaultValuePipe, Delete,
  Get, HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query, Req, UploadedFile,
  UseGuards, UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { GetUsersChatParamDto } from './dtos/get-users-chat-param.dto';
import { AdminGuard } from './guards/admin.guard';
import { IsUserExistsGuard } from './guards/is-user-exists.guard';
import { IsUserRegisterGuard } from './guards/is-user-register.guard';
import { FileValidationPipe } from '../file/pipes/file-validation.pipe';
import {FileAvatarValidationPipe } from '../file/pipes/avatar-validation.pipe';
import { UserValidationPipe } from './pipes/user-validation.pipe';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CustomRequest } from './interfaces/custom-request.interface';
import { PasswordTokenGuard } from '../auth/guards/password-token.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {
  }

  @Get()
  @UseGuards(AccessTokenGuard, AdminGuard)
  public getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('perPage', new DefaultValuePipe(5), ParseIntPipe) perPage: number,
  ) {
    return this.usersService.getAllUsersWithPagination(page, perPage);
  }

  @Get("chat/:userId")
  @UseGuards(AccessTokenGuard, IsUserExistsGuard)
  public async getUsersToChat(
    @Param() getUsersChatParamDto: GetUsersChatParamDto,
    @Query('admin') admin: string,
  ) {
    return await this.usersService.getChatUsers(getUsersChatParamDto.userId, admin === 'true');
  }

  @Post()
  @UseGuards(IsUserRegisterGuard)
  @UsePipes(FileValidationPipe, FileAvatarValidationPipe, UserValidationPipe)
  public createUser(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
    return this.usersService.createUser(createUserDto, req['avatar']);
  }

  @Delete('admin/:userId')
  @UseGuards(AccessTokenGuard, IsUserExistsGuard)
  @HttpCode(204)
  async deleteUserByAdmin(@Param('userId') userId: string, @Req() req: Request) {
    return await this.usersService.softDeleteUserByAdmin(req['user']);
  }

  @Patch('admin/:userId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard, AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateUserByAdmin(@Param('userId') userId: string, @Body() updateData: UpdateUserDto) {
    await this.usersService.updateUserDetailsByAdmin(userId, updateData);
    return { message: 'User updated successfully' };
  }

  @Get(':userId')
  @UseGuards(IsUserExistsGuard)
  async getUser(@Param('userId') userId: string, @Req() req: CustomRequest) {
    return req.user;
  }

  @Delete(':userId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard)
  async deleteUser(@Req() req: CustomRequest) {
    const user = req.user;
    const token = req.headers.authorization;

    await this.usersService.softDeleteUser(user, token);
    return { message: 'User successfully deleted' };
  }

  @Patch(':userId')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard)
  async updateUser(@Req() req: CustomRequest, @Body() updateData: UpdateUserDto) {
    await this.usersService.updateUserDetails(req.user, updateData);
    return { message: 'User successfully updated' };
  }

  @Patch(':userId/changePassword/activate')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard)
  async verifyUserToChangePassword(@Req() req: CustomRequest) {
    await this.usersService.verifyToChangePassword(req.user);
    return { message: 'Check your email for password reset instructions' };
  }

  @Patch(':userId/changePassword/change')
  @UseGuards(IsUserExistsGuard, PasswordTokenGuard)
  async changeUserPassword(@Req() req: CustomRequest, @Body() changePasswordDto: ChangePasswordDto) {
    const passwordToken = req.headers.authorization;
    await this.usersService.changePassword(req.user, changePasswordDto.password, passwordToken);
    return { message: 'Password successfully changed' };
  }

  @Patch(':userId/avatar/update')
  @UseGuards(IsUserExistsGuard, AccessTokenGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async updateOrDeleteAvatar(
    @Req() req: CustomRequest,
    @UploadedFile(FileAvatarValidationPipe) avatar: Express.Multer.File
    ) {

    req.avatar = avatar;
    const result = await this.usersService.updateOrDeleteUserAvatar(req, req.url);

    if (result === 'DELETED') {
      return { message: 'Avatar successfully deleted' };
    }
    return { message: 'Avatar successfully updated' };
  }
}
