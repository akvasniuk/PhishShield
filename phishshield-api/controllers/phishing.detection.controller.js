const {phishingDetectionService} = require("../services");
const {statusCode} = require("../constants");

module.exports = {
    getPhishingHistory: async (req, res, next) => {
        try {
            const {user} = req;
            const {page = 1, perPage = 5, search} = req.query;

            const phishingHistory = await phishingDetectionService
              .getPhishingHistory(user._id, +page, +perPage, search);
            res.status(statusCode.UPDATED).json(phishingHistory);
        } catch (e) {
            next(e);
        }
    },

    predictPhishing: async (req, res, next) => {
        try {
            const {type} = req.query;
            const bodyData = req.body;
            const {documentPrediction, user} = req;

            const responseData = await phishingDetectionService.predictPhishing(type,bodyData,documentPrediction, user);
            res.status(statusCode.UPDATED).json(responseData);
        } catch (e) {
            next(e);
        }
    },
}