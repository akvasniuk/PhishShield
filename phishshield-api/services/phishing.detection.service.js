const { phishingDetectionRepository } = require('../repositories');
const axios = require('axios');
const { fileReaderService } = require('./index');
const { constants } = require('../constants');
const { scrapeWebsite } = require('./scraper.service');

module.exports = {
  getPhishingHistory: async (userId, page, perPage, search) => {
    const phishingCount = await phishingDetectionRepository.countPhishing(userId, search);
    const phishingItems = await phishingDetectionRepository.getPhishingItems(userId, page, perPage, search);

    return {
      phishingItems,
      page,
      pages: phishingCount ? Math.ceil(phishingCount / perPage) : 1,
      totalCount: phishingCount,
    };
  },

  predictPhishing: async (type, bodyData, documentPrediction, user, audioPrediction) => {
    let responseData;
    let image;

    if (type === 'file') {
      const fileData = await fileReaderService.readFileByMimeType(documentPrediction);
      bodyData[type] = fileData;
      const { data } = await axios.post(constants.PHISHING_PREDICT_API.BY_TEXT, { 'text': fileData });
      responseData = data;
    } else if (type === 'text') {
      const { data } = await axios.post(constants.PHISHING_PREDICT_API.BY_TEXT, { [type]: bodyData[type] });
      responseData = data;
    } else if (type === 'url') {
      const { htmlContent, screenshotBuffer, imageUrl } = await scrapeWebsite(bodyData[type]);
      const { data: htmlData } = await axios.post(constants.PHISHING_PREDICT_API.BY_URL_HTML, { 'html_content': htmlContent });
      const { data: urlData } = await axios.post(constants.PHISHING_PREDICT_API.BY_URL, { [type]: bodyData[type] });

      const imagePrediction = {
        data: screenshotBuffer,
        mimetype: 'image/png',
        name: 'screenshot.png',
      };

      const formData = new FormData();
      const fileBlob = new Blob([imagePrediction.data], { type: imagePrediction.mimetype });
      formData.append('file', fileBlob, imagePrediction.name);
      const { data: imgData } = await axios.post(constants.PHISHING_PREDICT_API.BY_URL_IMG, formData);

      responseData = { ...htmlData, ...urlData, ...imgData };
      image = imageUrl;
    } else if (type === 'audio') {
      const { mimetype, data } = audioPrediction;

      const formData = new FormData();
      const fileBlob = new Blob([data], { type: mimetype });
      formData.append('file', fileBlob, audioPrediction.name);
      const { data: audioData } = await axios.post(constants.PHISHING_PREDICT_API.BY_URL_AUDIO, formData);
      responseData = audioData;
      bodyData[type] = audioData.text;
    }

    const resultsArray = Object.keys(responseData)
      .filter(key => key.includes('_prediction'))
      .map(key => {
        const modelName = key.replace('_prediction', '').replace(/_/g, ' ');
        const probabilityKey = key.replace('_prediction', '_probability');

        const rawPrediction = responseData[key];
        const convertedPrediction = (rawPrediction === 1 || rawPrediction === 'good') ? 1 : 0;

        return {
          model: modelName.charAt(0).toUpperCase() + modelName.slice(1),
          prediction: convertedPrediction,
          probability: responseData[probabilityKey] || null,
        };
      });

    const phishingItem = {
      type: type,
      data: bodyData[type],
      userId: user._id,
      file: documentPrediction?.name || audioPrediction?.name,
      predictions: resultsArray,
      image
    };

    await phishingDetectionRepository.createPhishingRecord(phishingItem);
    return { resultsArray };
  },
};
