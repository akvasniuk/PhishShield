const { userRepository, phishingDetectionRepository } = require("../repositories");

module.exports = {
  getNumberOfUsers: async () => {
    const totalUsers = await userRepository.getNumberOfUsers();

    const currentDate = new Date();
    const lastYearDate = new Date(currentDate.getFullYear() - 1,
      currentDate.getMonth(), currentDate.getDate());

    const result = await userRepository.getUsersFromYear(lastYearDate);
    const totalUsersFromLastYear = result?.length > 0 ? result[0].totalUsers : 0;
    const percentage = ((totalUsers - totalUsersFromLastYear) / totalUsers) * 100;
    const totalNewUsers = totalUsers - totalUsersFromLastYear;
    userRepository.countUsers();

    return {
      totalUsers, percentage, totalNewUsers
    }
  },

  getNumberOfUsersByMonth: async () => {
    const currentYear = new Date(new Date().getFullYear(), 0, 1);
    const numberOfUsersByMonth = await userRepository.getMonthlyUserStatistic(currentYear);

    const monthlyData = Array(12).fill(0);
    numberOfUsersByMonth.forEach(item => {
      monthlyData[item._id.month - 1] = item.total;
    });

    return monthlyData;
  },

  getNumberOfUsersByWeek:  () => {
    const currentYear = new Date();
    const currentWeek = new Date(currentYear);
    currentWeek.setDate(currentYear.getDate() - currentYear.getDay());
    currentWeek.setDate(currentWeek.getDate() + 1)

    return userRepository.getWeeklyUserStatistic(currentWeek);
  },

  getNumberOfPredictionByType:  () => phishingDetectionRepository.getPhishingByType(),

  getNumberOfUsersByAuth:  () => userRepository.getUsersByAuth(),

  getNumberOfPredictionByMonth:  async () => {
    const currentYear = new Date(new Date().getFullYear(), 0, 1);
    const numberOfPredictionByMonth = await phishingDetectionRepository.getMonthlyPredictionStatistic(currentYear);

    const monthlyData = Array(12).fill(0);
    numberOfPredictionByMonth.forEach(item => {
      monthlyData[item._id.month - 1] = item.total;
    });

    return monthlyData;
  },

  getNumberOfPredictionsByWeek:  async (prediction) => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const numberOfPredictionsByWeek = await phishingDetectionRepository
      .getWeeklyDetectionStatistic(startOfWeek, endOfWeek, prediction);

    const weeklyData = Array(7).fill(0);
    numberOfPredictionsByWeek.forEach(item => {
      const dayIndex = item._id.day === 1 ? 0 : item._id.day - 1;
      weeklyData[dayIndex] = item.total;
    });

    return weeklyData;
  },

};