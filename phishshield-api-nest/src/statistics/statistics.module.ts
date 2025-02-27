import { forwardRef, Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { UsersModule } from '../users/users.module';
import { PhishingDetectionModule } from '../phishing-detection/phishing-detection.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => PhishingDetectionModule)
  ]
})
export class StatisticsModule {}
