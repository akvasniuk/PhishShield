import { BadRequestException, Injectable } from '@nestjs/common';
import { PhishingDetectionRepository } from '../phishing-detection.repository';
import { Types } from 'mongoose';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { FileReaderService } from './file-reader.service';
import { ScraperService } from './scraper.service';
import { PredictPhishingDto } from '../dto/predict-phishing.dto';
import { User } from '../../users/user.schema';

@Injectable()
export class PhishingDetectionService {
  constructor(
    private readonly phishingDetectionRepository: PhishingDetectionRepository,
    private readonly configService: ConfigService,
    private readonly fileReaderService: FileReaderService,
    private readonly scraperService: ScraperService
  ) {}

  async getPhishingHistory(userId: string, page: number, perPage: number, search?: string) {
    const phishingCount = await this.phishingDetectionRepository.countPhishing(
      new Types.ObjectId(userId),
      search,
    );
    const phishingItems = await this.phishingDetectionRepository.getPhishingItems(
      new Types.ObjectId(userId),
      page,
      perPage,
      search,
    );

    return {
      phishingItems,
      page,
      pages: phishingCount ? Math.ceil(phishingCount / perPage) : 1,
      totalCount: phishingCount,
    };
  }

  async predictPhishing(type: string, bodyData: PredictPhishingDto, documentPrediction: Express.Multer.File,
                        audioPrediction: Express.Multer.File, user: User) {
    let responseData: Record<string, any>;
    let imageUrl: string | undefined;

    switch (type) {
      case 'file': {
        const fileData = await this.fileReaderService.readFileByMimeType(documentPrediction);
        bodyData[type] = fileData;

        const { data } = await axios.post(this.configService.get<string>('PHISHING_PREDICT_API_BY_TEXT'), { text: fileData });
        responseData = data;
        break;
      }

      case 'text': {
        const { data } = await axios.post(this.configService.get<string>('PHISHING_PREDICT_API_BY_TEXT'), { [type]: bodyData[type] });
        responseData = data;
        break;
      }

      case 'url': {
        const { htmlContent, screenshotBuffer, imageUrl: imgUrl } = await this.scraperService.scrapeWebsite(bodyData[type]);
        imageUrl = imgUrl;

        const { data: htmlData } = await axios.post(this.configService.get<string>("PHISHING_PREDICT_API_BY_URL_HTML"), { html_content: htmlContent });
        const { data: urlData } = await axios.post(this.configService.get<string>("PHISHING_PREDICT_API_BY_URL"), { [type]: bodyData[type] });

        const formData = new FormData();
        formData.append('file', new Blob([screenshotBuffer], { type: 'image/png' }), 'screenshot.png');

        const { data: imgData } = await axios.post(this.configService.get<string>("PHISHING_PREDICT_API_BY_URL_IMG"), formData);

        responseData = { ...htmlData, ...urlData, ...imgData };
        break;
      }

      case 'audio': {
        const { mimetype, buffer: data } = audioPrediction;

        const formData = new FormData();
        formData.append('file', new Blob([data], { type: mimetype }), audioPrediction.originalname);

        const { data: audioData } = await axios.post(this.configService.get<string>("PHISHING_PREDICT_API_BY_URL_AUDIO"), formData);
        responseData = audioData;

        bodyData[type] = audioData.text;
        break;
      }

      default:
        throw new BadRequestException('Invalid type for phishing prediction');
    }

    const resultsArray = Object.keys(responseData)
      .filter(key => key.includes('_prediction'))
      .map(key => {
        const modelName = key.replace('_prediction', '').replace(/_/g, ' ');
        const probabilityKey = key.replace('_prediction', '_probability');

        const rawPrediction = responseData[key];
        const convertedPrediction = rawPrediction === 1 || rawPrediction === 'good' ? 1 : 0;

        return {
          model: modelName.charAt(0).toUpperCase() + modelName.slice(1),
          prediction: convertedPrediction,
          probability: responseData[probabilityKey] || null,
        };
      });

    await this.phishingDetectionRepository.createPhishingRecord({
      type,
      data: bodyData[type],
      userId: user._id as Types.ObjectId,
      file: documentPrediction?.originalname || audioPrediction?.originalname,
      predictions: resultsArray,
      image: imageUrl,
    });

    return { resultsArray };
  }
}
