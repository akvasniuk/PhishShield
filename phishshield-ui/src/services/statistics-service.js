import {axiosService} from "./axios-service";

import {urls} from "../configs";

const statisticsService = {
    getNumberOfUsers: () => axiosService.get(urls.statistics.getNumberOfUsers),
    getNumberOfPredictions: () => axiosService.get(urls.statistics.getNumberOfPredictions),
    getNumberOfUsersByMonth: () => axiosService.get(urls.statistics.getNumberOfUsersByMonth),
    getNumberOfPredictionsByWeek: () => axiosService.get(urls.statistics.getNumberOfPredictionsByWeek),
    getNumberOfPositivePredictionsByWeek: () => axiosService.get(urls.statistics.getNumberOfPositivePredictionsByWeek),
    getNumberOfNegativePredictionsByWeek: () => axiosService.get(urls.statistics.getNumberOfNegativePredictionsByWeek),
    getNumberOfPredictionsByType: () => axiosService.get(urls.statistics.getNumberOfPredictionByType),
    getNumberOfPredictionsByMonth: () => axiosService.get(urls.statistics.getNumberOfPredictionByMonth),
    getNumberOfUsersByAuth: () => axiosService.get(urls.statistics.getNumberOfUsersByAuth),
}

export {
    statisticsService
}