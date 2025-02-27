import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req, UploadedFile,
  UseGuards, UseInterceptors,
} from '@nestjs/common';
import { PhishingDetectionService } from './services/phishing-detection.service';
import { Request } from 'express';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { PredictPhishingDto } from './dto/predict-phishing.dto';
import { TypeValidationPipe } from './pipes/type-validation.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationPipe } from 'src/file/pipes/file-validation.pipe';

@Controller('predict-phishing')
export class PhishingDetectionController {
  constructor(
    private readonly phishingDetectionService: PhishingDetectionService,
  ) {
  }

  @UseGuards(AccessTokenGuard)
  @Get('history')
  async getPhishingHistory(
    @Req() req: Request,
    @Query('page') page = 1,
    @Query('perPage') perPage = 5,
    @Query('search') search?: string,
  ) {
    const user = req['user'];
    return this.phishingDetectionService.getPhishingHistory(
      user._id,
      +page,
      +perPage,
      search,
    );
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(FileInterceptor('file'))
  async predictPhishing(
    @Query('type', TypeValidationPipe) type: string,
    @Body() bodyData: PredictPhishingDto,
    @Req() req: any,
    @UploadedFile(new FileValidationPipe())
    fileResult: { audio?: Express.Multer.File, document?: Express.Multer.File },
  ) {
    const { user } = req;

    if (type === 'file') {
      if (!fileResult.document) {
        throw new BadRequestException('No document provided for prediction.');
      }
      req.documentPrediction = fileResult.document;
    } else if (type === 'audio') {
      if (!fileResult.audio) {
        throw new BadRequestException('No audio file provided for prediction.');
      }
      req.audioPrediction = fileResult.audio;
    } else if (['text', 'url'].includes(type)) {
      if (!bodyData[type]) {
        throw new BadRequestException(`Missing required field: ${type}`);
      }
    } else {
      throw new BadRequestException('Invalid type');
    }

    return this.phishingDetectionService.predictPhishing(
      type,
      bodyData,
      req.documentPrediction,
      req.audioPrediction,
      user
    );
  }

}
