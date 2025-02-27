import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserValidationPipe implements PipeTransform {
  async transform(value: any) {
    if (value.avatar) delete value.avatar;
    if (value.photo) delete value.photo;

    const dtoInstance = plainToInstance(CreateUserDto, value);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new BadRequestException(errors.map(err => Object.values(err.constraints || {})).join(', '));
    }

    return dtoInstance;
  }
}
