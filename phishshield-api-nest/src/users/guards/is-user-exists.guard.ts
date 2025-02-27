import { CanActivate, ExecutionContext, Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from '../user.repository';
import { UserHelper } from '../helpers/user.helper';

@Injectable()
export class IsUserExistsGuard implements CanActivate {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly userHelper: UserHelper,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.params;

    const userById = await this.usersRepository.findUser({ _id: userId });

    if (!userById) {
      throw new NotFoundException('User does not exist');
    }

    request.user = this.userHelper.userNormalization(userById);
    return true;
  }
}
