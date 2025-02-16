import {axiosService} from "./axios-service";

import {urls} from "../configs";

const phishingDetectionService = {
    getPredictionHistory: (page = 1, perPage = 5, search) => axiosService.get(urls.phishingDetection.phishingHistoryURL, {params: {page, perPage, search}}),
    getDisease: (diseaseId) => axiosService.get(`${urls.disease.diseaseURL}/${diseaseId}`),
    predictPhishing: (data, type) => axiosService.post(`${urls.phishingDetection.phishingDetectionURL}`, data,
        {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            params: {
                type
            }
        }
    ),
    analyse: (diseaseName, t) => axiosService.post(`${urls.disease.analyseURL}/diseases/${diseaseName}`),
    createDiseaseHistory: (userId, diseaseId, data) => axiosService.post(`${urls.disease.diseasesHistoryURL}/${userId}/${diseaseId}`, data),
    getDiseaseHistory: (userId) => axiosService.get(`${urls.disease.diseasesHistoryURL}/${userId}`),
    getUserThread: (userId) => axiosService.get(`${urls.disease.analyseURL}/userThread/${userId}`),
    createRun: (threadId) => axiosService.post(`${urls.disease.analyseURL}/run/${threadId}`),
    retrieveRun: (threadId, runId) => axiosService.get(`${urls.disease.analyseURL}/run/${threadId}/${runId}`),
    getMessages: (threadId) => axiosService.get(`${urls.disease.analyseURL}/messages/${threadId}`),
    createMessage: (threadId, data) => axiosService.post(`${urls.disease.analyseURL}/messages/create/${threadId}`, data),
}

export {
    phishingDetectionService
}