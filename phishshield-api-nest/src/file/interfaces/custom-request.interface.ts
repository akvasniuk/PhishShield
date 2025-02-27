import { UploadedFile } from 'express-fileupload';
import { Request } from 'express';

export interface CustomRequest extends Request {
  files?: { [key: string]: UploadedFile | UploadedFile[] };
  photos?: UploadedFile[];
  videos?: UploadedFile[];
  documents?: UploadedFile[];
  avatar?: UploadedFile;
  audios?: UploadedFile[]
}