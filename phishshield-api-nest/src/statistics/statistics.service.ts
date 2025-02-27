import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/user.repository';
import { PhishingDetectionRepository } from '../phishing-detection/phishing-detection.repository';

@Injectable()
export class StatisticsService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly phishingDetectionRepository: PhishingDetectionRepository,
    ) {}

  async getNumberOfUsers() {
    const totalUsers = await this.usersRepository.getNumberOfUsers();

    const currentDate = new Date();
    const lastYearDate = new Date(
      currentDate.getFullYear() - 1,
      currentDate.getMonth(),
      currentDate.getDate(),
    );

    const result = await this.usersRepository.getUsersFromYear(lastYearDate);
    const totalUsersFromLastYear = result?.length > 0 ? result[0].totalUsers : 0;
    const percentage = ((totalUsers - totalUsersFromLastYear) / totalUsers) * 100;
    const totalNewUsers = totalUsers - totalUsersFromLastYear;
    await this.usersRepository.countUsers();

    return { totalUsers, percentage, totalNewUsers };
  }

  async getNumberOfUsersByMonth() {
    const currentYear = new Date(new Date().getFullYear(), 0, 1);
    const numberOfUsersByMonth = await this.usersRepository.getMonthlyUserStatistic(currentYear);

    const monthlyData = Array(12).fill(0);
    numberOfUsersByMonth.forEach(item => {
      monthlyData[item._id.month - 1] = item.total;
    });

    return monthlyData;
  }

  async getNumberOfUsersByWeek() {
    const currentYear = new Date();
    const currentWeek = new Date(currentYear);
    currentWeek.setDate(currentYear.getDate() - currentYear.getDay());
    currentWeek.setDate(currentWeek.getDate() + 1);

    return this.usersRepository.getWeeklyUserStatistic(currentWeek);
  }

  async getNumberOfPredictionByType() {
    return this.phishingDetectionRepository.getPhishingByType();
  }

  async getNumberOfUsersByAuth() {
    return this.usersRepository.getUsersByAuth();
  }

  async getNumberOfPredictionByMonth() {
    const currentYear = new Date(new Date().getFullYear(), 0, 1);
    const numberOfPredictionByMonth = await this.phishingDetectionRepository.getMonthlyPredictionStatistic(currentYear);

    const monthlyData = Array(12).fill(0);
    numberOfPredictionByMonth.forEach(item => {
      monthlyData[item._id.month - 1] = item.total;
    });

    return monthlyData;
  }

  async getNumberOfPredictionsByWeek(prediction?: number[]) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const numberOfPredictionsByWeek = await this.phishingDetectionRepository.getWeeklyDetectionStatistic(
      startOfWeek,
      endOfWeek,
      prediction,
    );

    const weeklyData = Array(7).fill(0);
    numberOfPredictionsByWeek.forEach(item => {
      const dayIndex = item._id.day === 1 ? 0 : item._id.day - 1;
      weeklyData[dayIndex] = item.total;
    });

    return weeklyData;
  }
}
