const {userService, viewService, diseaseHistoryService, analyseService, phishingDetectionService} = require("../services");
const {statusCode, successfulMessage} = require("../constants");


module.exports = {
    getNumberOfUsers: async (req, res, next) => {
        try {
            const totalUsers = await userService.getNumberOfUsers();

            const currentDate = new Date();
            const lastYearDate = new Date(currentDate.getFullYear() - 1,
                currentDate.getMonth(), currentDate.getDate());

            const result = await userService.getUsersFromYear(lastYearDate);
            const totalUsersFromLastYear = result?.length > 0 ? result[0].totalUsers : 0;
            const percentage = ((totalUsers - totalUsersFromLastYear) / totalUsers) * 100;
            const totalNewUsers = totalUsers - totalUsersFromLastYear;

            res.status(statusCode.UPDATED).json({totalUsers, percentage, totalNewUsers});
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictions: async (req, res, next) => {
        try {
            const totalPredictions = await diseaseHistoryService.getTotalDiseases();

            const currentDate = new Date();
            const lastYearDate = new Date(currentDate.getFullYear() - 1,
                currentDate.getMonth(), currentDate.getDate());

            const result = await diseaseHistoryService.getDiseasesFromYear(lastYearDate);
            const totalPredictionsFromLastYear = result?.length > 0 ? result[0].totalPredictions : 0;
            const percentage = ((totalPredictions - totalPredictionsFromLastYear) / totalPredictions) * 100;
            const totalNewPredictions = totalPredictions - totalPredictionsFromLastYear;

            res.status(statusCode.UPDATED).json({totalPredictions, percentage, totalNewPredictions});
        } catch (e) {
            next(e);
        }
    },

    getNumberOfAnalysis: async (req, res, next) => {
        try {
            const totalAnalysis = await analyseService.totalAnalysis();

            const currentDate = new Date();
            const lastYearDate = new Date(currentDate.getFullYear() - 1,
                currentDate.getMonth(), currentDate.getDate());

            const result = await analyseService.getAnalysisFromYear(lastYearDate);
            const totalAnalysisFromLastYear = result?.length > 0 ? result[0].totalAnalyse : 0;
            const percentage = ((totalAnalysis - totalAnalysisFromLastYear) / totalAnalysis) * 100;
            const totalNewAnalysis = totalAnalysis - totalAnalysisFromLastYear;

            res.status(statusCode.UPDATED).json({totalAnalysis, percentage, totalNewAnalysis});
        } catch (e) {
            next(e);
        }
    },


    createView: async (req, res, next) => {
        try {
            await viewService.insertView();
            res.status(statusCode.CREATED).json(successfulMessage.VIEW_CREATED);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfViews: async (req, res, next) => {
        try {
            const totalViews = await viewService.totalViews();

            const currentDate = new Date();
            const lastYearDate = new Date(currentDate.getFullYear() - 1,
                currentDate.getMonth(), currentDate.getDate());

            const result = await viewService.getViewsFromYear(lastYearDate);
            const totalViewsFromLastYear = result?.length > 0 ? result[0].totalUsers : 0;
            const percentage = ((totalViews - totalViewsFromLastYear) / totalViews) * 100;
            const totalNewViews = totalViews - totalViewsFromLastYear;

            res.status(statusCode.UPDATED).json({totalViews, percentage, totalNewViews});
        } catch (e) {
            next(e);
        }
    },

    getNumberOfUsersByMonth: async (req, res, next) => {
        try {
            const currentYear = new Date(new Date().getFullYear(), 0, 1);
            const numberOfUsersByMonth = await userService.getMonthlyUserStatistic(currentYear);

            const monthlyData = Array(12).fill(0);
            numberOfUsersByMonth.forEach(item => {
                monthlyData[item._id.month - 1] = item.total;
            });

            res.status(statusCode.UPDATED).json(monthlyData);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfViewsByMonth: async (req, res, next) => {
        try {
            const currentYear = new Date(new Date().getFullYear(),
                0, 1);
            const numberOfViewsByYear = await viewService.getMonthlyViewStatist(currentYear);

            res.status(statusCode.UPDATED).json(numberOfViewsByYear);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfUsersByWeek: async (req, res, next) => {
        try {
            const currentYear = new Date();
            const currentWeek = new Date(currentYear);
            currentWeek.setDate(currentYear.getDate() - currentYear.getDay());
            currentWeek.setDate(currentWeek.getDate() + 1)

            const numberOfUsersByWeek = await userService.getWeekUserStatist(currentWeek);

            res.status(statusCode.UPDATED).json(numberOfUsersByWeek);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfViewsByWeek: async (req, res, next) => {
        try {
            const currentYear = new Date();
            const currentWeek = new Date(currentYear);
            currentWeek.setDate(currentYear.getDate() - currentYear.getDay());
            currentWeek.setDate(currentWeek.getDate() + 1)

            const numberOfViewsByWeek = await viewService.getWeekViewStatist(currentWeek);

            res.status(statusCode.UPDATED).json(numberOfViewsByWeek);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictionByType: async (req, res, next) => {
        try {
            const numberOfPhishingByType = await phishingDetectionService.getPhishingByType();

            res.status(statusCode.UPDATED).json(numberOfPhishingByType);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfUsersByAuth: async (req, res, next) => {
        try {
            const numberOfUsersByAuth = await userService.getUsersByAuth();

            res.status(statusCode.UPDATED).json(numberOfUsersByAuth);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictionByMonth: async (req, res, next) => {
        try {
            const currentYear = new Date(new Date().getFullYear(), 0, 1);
            const numberOfPredictionByMonth = await phishingDetectionService.getMonthlyPredictionStatistic(currentYear);

            const monthlyData = Array(12).fill(0);
            numberOfPredictionByMonth.forEach(item => {
                monthlyData[item._id.month - 1] = item.total;
            });

            res.status(statusCode.UPDATED).json(monthlyData);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictionsByWeek: (prediction) => async (req, res, next) => {
        try {
            const today = new Date();
            const dayOfWeek = today.getDay();
            const diffToMonday = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;

            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() + diffToMonday);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const numberOfPredictionsByWeek = await phishingDetectionService
                .getWeeklyDetectionStatistic(startOfWeek, endOfWeek, prediction);

            const weeklyData = Array(7).fill(0);
            numberOfPredictionsByWeek.forEach(item => {
                const dayIndex = item._id.day === 1 ? 0 : item._id.day - 1;
                weeklyData[dayIndex] = item.total;
            });

            res.status(statusCode.UPDATED).json(weeklyData);
        } catch (e) {
            next(e);
        }
    },
}