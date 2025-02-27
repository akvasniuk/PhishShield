import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class TypeValidationPipe implements PipeTransform {
  private readonly allowedTypes = ['text', 'url', 'file', 'audio'];

  transform(value: any) {
    if (!this.allowedTypes.includes(value)) {
      throw new BadRequestException(`Invalid type: ${value}. Allowed values: ${this.allowedTypes.join(', ')}`);
    }
    return value;
  }
}