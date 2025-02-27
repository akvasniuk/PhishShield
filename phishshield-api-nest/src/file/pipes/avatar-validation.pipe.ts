import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import {
  FILE_CONSTANTS,
  PhotoMimeType,
} from '../../constants';

const {
  PHOTO_MAX_SIZE,
  PHOTOS_MIMETYPES,
} = FILE_CONSTANTS;

@Injectable()
export class FileAvatarValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File | Express.Multer.File[]): Express.Multer.File {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const files = Array.isArray(file) ? file : [file];

    if (files.length > 1) {
      throw new BadRequestException('Only one avatar can be uploaded');
    }

    const avatar = files[0];
    const { originalname, size, mimetype } = avatar;

    if (!PHOTOS_MIMETYPES.includes(mimetype as PhotoMimeType)) {
      throw new BadRequestException(`Invalid file format: ${originalname}`);
    }

    if (size > PHOTO_MAX_SIZE) {
      throw new BadRequestException(`File ${originalname} is too large`);
    }

    return avatar;
  }
}
