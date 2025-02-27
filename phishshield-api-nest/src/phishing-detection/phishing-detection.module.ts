import { forwardRef, Module } from '@nestjs/common';
import { PhishingDetectionService } from './services/phishing-detection.service';
import { PhishingDetectionController } from './phishing-detection.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PhishingDetection, PhishingDetectionSchema } from './phishing-detection.schema';
import { PhishingDetectionRepository } from './phishing-detection.repository';
import { FileReaderService } from './services/file-reader.service';
import { FileModule } from '../file/file.module';
import { ScraperService } from './services/scraper.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [PhishingDetectionController],
  providers: [PhishingDetectionService, PhishingDetectionRepository, ScraperService, FileReaderService],
  imports: [
    MongooseModule.forFeature([
      {
        name: PhishingDetection.name,
        schema: PhishingDetectionSchema
      },
    ]),
    FileModule,
    forwardRef(() => AuthModule )
  ],
  exports: [PhishingDetectionRepository]
})
export class PhishingDetectionModule {}
