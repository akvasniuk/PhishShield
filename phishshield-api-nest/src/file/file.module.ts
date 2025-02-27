import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { FileValidationPipe } from './pipes/file-validation.pipe';
import { FileAvatarValidationPipe } from './pipes/avatar-validation.pipe';
import { FileReaderService } from '../phishing-detection/services/file-reader.service';

@Module({
  controllers: [FileController],
  providers: [FileService, FileValidationPipe, FileAvatarValidationPipe, FileReaderService],
  exports: [FileValidationPipe, FileAvatarValidationPipe, FileService, FileReaderService],
})
export class FileModule {}
