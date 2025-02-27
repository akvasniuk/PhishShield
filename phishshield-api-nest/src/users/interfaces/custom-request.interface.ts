import { Express, Request } from 'express';
import { User } from '../user.schema';
import { UploadedFile } from 'express-fileupload';

export interface CustomRequest extends Request {
  user?: User;
  avatar?: Express.Multer.File;
  photos?: UploadedFile[];
}