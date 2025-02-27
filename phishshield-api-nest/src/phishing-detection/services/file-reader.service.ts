import { Injectable, BadRequestException } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as xlsx from 'xlsx';
import { fromBufferWithMime } from 'textract';

@Injectable()
export class FileReaderService {
  async readFileByMimeType(file: Express.Multer.File): Promise<string> {
    const { mimetype, buffer: data } = file;

    try {
      switch (mimetype) {
        case 'application/pdf':
          return await this.readPdf(data);

        case 'application/octet-stream':
        case 'text/plain':
          return this.readTxt(data);

        case 'application/msword':
          return await this.readDoc(data);

        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          return await this.readDocx(data);

        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return this.readXlsx(data);

        default:
          throw new BadRequestException(`Format ${mimetype} is not supported.`);
      }
    } catch (error) {
      console.error('Reading error:', error);
      throw new BadRequestException('An error occurred while reading the file.');
    }
  }

  private async readDocx(buffer: Buffer): Promise<string> {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  }

  private readDoc(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      fromBufferWithMime('application/msword', buffer, (error, text) => {
        if (error) return reject(error);
        resolve(text);
      });
    });
  }

  private async readPdf(buffer: Buffer): Promise<string> {
    const data = await pdfParse(buffer);
    return data.text;
  }

  private readTxt(buffer: Buffer): string {
    return buffer.toString('utf-8');
  }

  private readXlsx(buffer: Buffer): string {
    const workbook = xlsx.read(buffer, { type: 'buffer' });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    return xlsx.utils.sheet_to_csv(worksheet);
  }
}
