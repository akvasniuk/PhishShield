const axios = require("axios");

const {userService, viewService, commentService, diseaseService, phishingDetectionService} = require("../services");
const {statusCode, successfulMessage} = require("../constants");
const {userHelper} = require("../helpers");

const {constants} = require('../constants/index');
const {fileReaderService} = require("../services");

module.exports = {
    getPhishingHistory: async (req, res, next) => {
        try {
            const {user} = req;

            const {page = 1, perPage = 5, search} = req.query;

            const phishingCount = await phishingDetectionService.countPhishing(user._id, search);
            const phishingItems = await phishingDetectionService.getPhishingItems(user.id, +page, +perPage, search);

            res.status(statusCode.UPDATED).json({
                phishingItems,
                page: +page,
                pages: phishingCount ? Math.ceil(phishingCount / perPage) : 1,
                totalCount: phishingCount
            });
        } catch (e) {
            next(e);
        }
    },

    getDisease: async (req, res, next) => {
        try {
            const {type} = req.query;
            const disease = await diseaseService.findDisease({_id: diseaseId}, {apiPath: 0, __v: 0});

            res.status(statusCode.UPDATED).json({disease});
        } catch (e) {
            next(e);
        }
    },

    predictPhishing: async (req, res, next) => {
        try {
            const {type} = req.query;
            let bodyData = req.body;
            const {documentPrediction, user} = req;
            let responseData;

            if (type === "file") {
                const fileData = await fileReaderService.readFileByMimeType(documentPrediction);
                bodyData[type] = fileData;
                const {data} = await axios.post(constants.PHISHING_PREDICT_API.BY_TEXT, {"text": fileData});
                responseData = data;
            } else if(type === "text" ) {
                const {data} = await axios.post(constants.PHISHING_PREDICT_API.BY_TEXT, {[type]: bodyData[type] })
                responseData = data;
            } else if(type === "url" ) {
                const {data} = await axios.post(constants.PHISHING_PREDICT_API.BY_URL, {[type]: bodyData[type]})
                responseData = data;
            }

            const resultsArray = Object.keys(responseData)
                .filter(key => key.includes("_prediction"))
                .map(key => {
                    const modelName = key.replace("_prediction", "").replace(/_/g, " ");
                    const probabilityKey = key.replace("_prediction", "_probability");

                    const rawPrediction = responseData[key];
                    const convertedPrediction = (rawPrediction === 1 || rawPrediction === "good") ? 1 : 0;

                    return {
                        model: modelName.charAt(0).toUpperCase() + modelName.slice(1),
                        prediction: convertedPrediction,
                        probability: responseData[probabilityKey] || null
                    };
                });

            console.log(resultsArray);

            const phishingItem = {
                type: type,
                data: bodyData[type],
                userId: user._id,
                file: documentPrediction?.name,
                predictions: resultsArray
            }

            phishingDetectionService.createPhishingRecord(phishingItem);

            res.status(statusCode.UPDATED).json(responseData);
        } catch (e) {
            next(e);
        }
    },
}