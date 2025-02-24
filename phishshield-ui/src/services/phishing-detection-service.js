import {axiosService} from "./axios-service";

import {urls} from "../configs";

const phishingDetectionService = {
    getPredictionHistory: (page = 1, perPage = 5, search) => axiosService.get(urls.phishingDetection.phishingHistoryURL, {params: {page, perPage, search}}),
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
}

export {
    phishingDetectionService
}