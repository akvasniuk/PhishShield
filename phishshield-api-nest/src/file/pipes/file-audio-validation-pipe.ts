import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Express } from 'express';
import { FILE_CONSTANTS, AudioMimeType } from '../../constants';

const { AUDIO_MAX_SIZE, AUDIO_MIMETYPES } = FILE_CONSTANTS;

@Injectable()
export class FileAudioValidationPipe implements PipeTransform {
  transform(file?: Express.Multer.File | Express.Multer.File[]): Express.Multer.File {
    if (!file) return undefined;

    const files = Array.isArray(file) ? file : [file];

    if (files.length > 1) {
      throw new BadRequestException('Only one audio file can be uploaded');
    }

    const audio = files[0];
    const { originalname, size, mimetype } = audio;

    if (!AUDIO_MIMETYPES.includes(mimetype as AudioMimeType)) {
      throw new BadRequestException(`Invalid audio format: ${originalname}`);
    }

    if (size > AUDIO_MAX_SIZE) {
      throw new BadRequestException(`Audio file ${originalname} is too large`);
    }

    return audio;
  }
}
