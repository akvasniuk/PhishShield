import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { UsersRepository } from '../user.repository';
import { CustomRequest } from '../interfaces/custom-request.interface';
import { Types } from 'mongoose';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly usersRepository: UsersRepository) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest<CustomRequest>();
    const { user } = request;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

      const userById = await this.usersRepository.findUser({ _id: user._id as Types.ObjectId });

    if (userById.role !== 'ADMIN') {
      throw new ForbiddenException('User must be an admin');
    }

    return true;
  }
}
