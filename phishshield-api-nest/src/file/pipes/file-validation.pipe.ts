import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { FILE_CONSTANTS, AudioMimeType, DocsMimeType } from '../../constants';

const { AUDIO_MAX_SIZE, AUDIO_MIMETYPES, DOCS_MAX_SIZE, DOCS_MIMETYPES } = FILE_CONSTANTS;

@Injectable()
export class FileValidationPipe implements PipeTransform {
  transform(files?: Express.Multer.File | Express.Multer.File[]): { audio?: Express.Multer.File, document?: Express.Multer.File } {
    if (!files) {
      return undefined;
    }

    const fileList = Array.isArray(files) ? files : [files];

    if (fileList.length > 1) {
      throw new BadRequestException('Only one file can be uploaded at a time');
    }

    const file = fileList[0];
    const { originalname, size, mimetype } = file;

    if (AUDIO_MIMETYPES.includes(mimetype as AudioMimeType)) {
      if (size > AUDIO_MAX_SIZE) {
        throw new BadRequestException(`Audio file ${originalname} is too large`);
      }
      return { audio: file };
    }

    if (DOCS_MIMETYPES.includes(mimetype as DocsMimeType)) {
      if (size > DOCS_MAX_SIZE) {
        throw new BadRequestException(`Document ${originalname} is too large`);
      }
      return { document: file };
    }

    throw new BadRequestException(`Invalid file format: ${originalname}`);
  }
}
