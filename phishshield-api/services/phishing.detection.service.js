const { phishingDetectionRepository } = require('../repositories');
const axios = require("axios");
const { fileReaderService } = require('./index');
const { constants } = require('../constants');

module.exports = {
    getPhishingHistory: async (userId, page, perPage, search) => {
        const phishingCount = await phishingDetectionRepository.countPhishing(userId, search);
        const phishingItems = await phishingDetectionRepository.getPhishingItems(userId, page, perPage, search);

        return {
            phishingItems,
            page,
            pages: phishingCount ? Math.ceil(phishingCount / perPage) : 1,
            totalCount: phishingCount
        };
    },

    predictPhishing: async (type, bodyData, documentPrediction, user) => {
        let responseData;

        if (type === "file") {
            const fileData = await fileReaderService.readFileByMimeType(documentPrediction);
            bodyData[type] = fileData;
            const {data} = await axios.post(constants.PHISHING_PREDICT_API.BY_TEXT, {"text": fileData});
            responseData = data;
        } else if(type === "text" ) {
            const {data} = await axios.post(constants.PHISHING_PREDICT_API.BY_TEXT, {[type]: bodyData[type] });
            responseData = data;
        } else if(type === "url" ) {
            const {data} = await axios.post(constants.PHISHING_PREDICT_API.BY_URL, {[type]: bodyData[type]});
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

        const phishingItem = {
            type: type,
            data: bodyData[type],
            userId: user._id,
            file: documentPrediction?.name,
            predictions: resultsArray
        };

        await phishingDetectionRepository.createPhishingRecord(phishingItem);

        return responseData;
    }
};
