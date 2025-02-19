const {statusCode} = require("../constants");
const { statisticsService } = require('../services');

module.exports = {
    getNumberOfUsers: async (req, res, next) => {
        try {
            const usersData = await statisticsService.getNumberOfUsers();
            res.status(statusCode.UPDATED).json(usersData);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfUsersByMonth: async (req, res, next) => {
        try {
            const monthlyData = await statisticsService.getNumberOfUsersByMonth();
            res.status(statusCode.UPDATED).json(monthlyData);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfUsersByWeek: async (req, res, next) => {
        try {
           const numberOfUsersByWeek = await statisticsService.getNumberOfUsersByWeek();
            res.status(statusCode.UPDATED).json(numberOfUsersByWeek);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictionByType: async (req, res, next) => {
        try {
            const numberOfPhishingByType = await statisticsService.getNumberOfPredictionByType();
            res.status(statusCode.UPDATED).json(numberOfPhishingByType);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfUsersByAuth: async (req, res, next) => {
        try {
            const numberOfUsersByAuth = await statisticsService.getNumberOfUsersByAuth();
            res.status(statusCode.UPDATED).json(numberOfUsersByAuth);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictionByMonth: async (req, res, next) => {
        try {
            const monthlyData = await statisticsService.getNumberOfPredictionByMonth();
            res.status(statusCode.UPDATED).json(monthlyData);
        } catch (e) {
            next(e);
        }
    },

    getNumberOfPredictionsByWeek: (prediction) => async (req, res, next) => {
        try {
            const weeklyData = await statisticsService.getNumberOfPredictionsByWeek(prediction);
            res.status(statusCode.UPDATED).json(weeklyData);
        } catch (e) {
            next(e);
        }
    },
}