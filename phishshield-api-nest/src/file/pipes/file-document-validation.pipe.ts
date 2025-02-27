import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { FILE_CONSTANTS, DocsMimeType } from '../../constants';

const { DOCS_MAX_SIZE, DOCS_MIMETYPES } = FILE_CONSTANTS;

@Injectable()
export class FileDocumentValidationPipe implements PipeTransform {
  transform(file?: Express.Multer.File | Express.Multer.File[]): Express.Multer.File {
    if (!file) return undefined;

    const files = Array.isArray(file) ? file : [file];

    if (files.length > 1) {
      throw new BadRequestException('Only one document can be uploaded');
    }

    const document = files[0];
    const { originalname, size, mimetype } = document;

    if (!DOCS_MIMETYPES.includes(mimetype as DocsMimeType)) {
      throw new BadRequestException(`Invalid document format: ${originalname}`);
    }

    if (size > DOCS_MAX_SIZE) {
      throw new BadRequestException(`Document ${originalname} is too large`);
    }

    return document;
  }
}
