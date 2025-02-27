import { PipeTransform, Injectable, BadRequestException, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class UsernameValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { username, user } = value;
    const userUsername = `${user.firstname} ${user.lastname}`;

    if (username !== userUsername) {
      throw new BadRequestException('Username does not match user profile');
    }

    return value;
  }
}