import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('totalUserStatistics')
  async getNumberOfUsers() {
    return this.statisticsService.getNumberOfUsers();
  }

  @Get('totalUsersStatisticsByMonth')
  async getNumberOfUsersByMonth() {
    return this.statisticsService.getNumberOfUsersByMonth();
  }

  @Get('totalUsersStatisticsByAuth')
  async getNumberOfUsersByAuth() {
    return this.statisticsService.getNumberOfUsersByAuth();
  }

  @Get('totalUsersStatisticsByWeek')
  async getNumberOfUsersByWeek() {
    return this.statisticsService.getNumberOfUsersByWeek();
  }

  @Get('/totalPredictionStatisticsByWeek')
  async getNumberOfPredictionsByWeek() {
    return this.statisticsService.getNumberOfPredictionsByWeek([0, 1]);
  }

  @Get('/totalPredictionPositiveStatisticsByWeek')
  async getNumberOfPositivePredictionsByWeek() {
    return this.statisticsService.getNumberOfPredictionsByWeek([1]);
  }

  @Get('/totalPredictionNegativeStatisticsByWeek')
  async getNumberOfNegativePredictionsByWeek() {
    return this.statisticsService.getNumberOfPredictionsByWeek([0]);
  }

  @Get('/totalPredictionStatisticsByType')
  async getNumberOfPredictionByType() {
    return this.statisticsService.getNumberOfPredictionByType();
  }

  @Get('/totalPredictionByMonth')
  async getNumberOfPredictionByMonth() {
    return this.statisticsService.getNumberOfPredictionByMonth();
  }
}
